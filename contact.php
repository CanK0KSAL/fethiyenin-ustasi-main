<?php
// Error reporting (development only - disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=UTF-8');
// Allow CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function respond($code, $arr) {
  http_response_code($code);
  echo json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function s($v) {
  $v = is_string($v) ? $v : '';
  $v = trim(preg_replace('/\s+/', ' ', $v));
  return preg_replace('/[\x00-\x1F\x7F]/u', '', $v);
}
function safeHeader($v) { return str_replace(["\r", "\n"], ' ', s($v)); }
function ext($name) {
  $p = strrpos($name, '.'); return $p === false ? '' : strtolower(substr($name, $p + 1));
}

// ---- Method (POST ve OPTIONS preflight desteği)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // CORS preflight request
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Max-Age: 86400');
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(405, ['ok' => false, 'error' => 'Method Not Allowed. Only POST method is supported.']);
}

// ---- Rate limit (IP başına 30sn)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$k = sys_get_temp_dir() . '/fu_contact_' . md5($ip) . '.lock';
$now = time();
if (file_exists($k)) {
  $last = (int) @file_get_contents($k);
  if ($now - $last < 30) respond(429, ['ok' => false, 'error' => 'Too Many Requests']);
}
@file_put_contents($k, (string)$now);

// ---- Input parse
$ct = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
$ct = strtolower($ct);

$data = null;
$isMultipart = strpos($ct, 'multipart/form-data') !== false;

if ($isMultipart) {
  // Values from $_POST
  $data = [
    'name'    => $_POST['name']    ?? '',
    'phone'   => $_POST['phone']   ?? '',
    'email'   => $_POST['email']   ?? '',
    'area'    => $_POST['area']    ?? '',
    'service' => $_POST['service'] ?? '',
    'message' => $_POST['message'] ?? '',
    'website' => $_POST['website'] ?? '',
    'page'    => $_POST['page']    ?? '',
    'tz'      => $_POST['tz']      ?? '',
    't'       => $_POST['t']       ?? date('c')
  ];
} else {
  $raw = file_get_contents('php://input');
  $j = json_decode($raw, true);
  $data = is_array($j) ? $j : $_POST;
}

// ---- Sanitize
$name    = s($data['name']    ?? '');
$phone   = s($data['phone']   ?? '');
$email   = s($data['email']   ?? '');
$area    = s($data['area']    ?? '');
$service = s($data['service'] ?? '');
$message = s($data['message'] ?? '');
$hp      = s($data['website'] ?? '');
$page    = s($data['page']    ?? '');
$tz      = s($data['tz']      ?? '');
$t       = s($data['t']       ?? date('c'));

if ($hp !== '') respond(400, ['ok' => false, 'error' => 'Spam detected']);
if (mb_strlen($name) < 2 || mb_strlen($name) > 80) respond(422, ['ok' => false, 'error' => 'Invalid name']);
if (!preg_match('/^[0-9 +()\-]{10,20}$/', $phone)) respond(422, ['ok' => false, 'error' => 'Invalid phone']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, ['ok' => false, 'error' => 'Invalid email']);
if ($area === '') respond(422, ['ok' => false, 'error' => 'Invalid area']);
if ($service === '') respond(422, ['ok' => false, 'error' => 'Invalid service']);
if (mb_strlen($message) < 15 || mb_strlen($message) > 2000) respond(422, ['ok' => false, 'error' => 'Invalid message']);
if (preg_match('/(https?:\/\/|www\.)/i', $message)) respond(422, ['ok' => false, 'error' => 'Links not allowed']);

// ---- Attachments validation
$allowedMime = ['image/jpeg','image/png','image/webp','image/avif','application/pdf'];
$allowedExt  = ['jpg','jpeg','png','webp','avif','pdf'];
$maxFiles = 5;
$maxFile = 5 * 1024 * 1024; // 5MB
$maxTotal = 12 * 1024 * 1024; // 12MB
$filesInfo = [];
$total = 0;

if ($isMultipart && isset($_FILES['files'])) {
  $f = $_FILES['files'];
  $count = is_array($f['name']) ? count($f['name']) : 0;

  for ($i = 0; $i < $count; $i++) {
    $err = (int)($f['error'][$i] ?? UPLOAD_ERR_NO_FILE);
    if ($err === UPLOAD_ERR_NO_FILE) continue;
    if ($err !== UPLOAD_ERR_OK) respond(422, ['ok' => false, 'error' => 'Upload error']);

    $tmp  = $f['tmp_name'][$i];
    $name0 = $f['name'][$i];
    $size = (int)$f['size'][$i];
    $name = basename($name0);
    $extension = ext($name);

    if (!in_array($extension, $allowedExt, true)) respond(415, ['ok' => false, 'error' => 'Unsupported file type']);
    if ($size <= 0 || $size > $maxFile) respond(413, ['ok' => false, 'error' => 'File too large']);
    $total += $size;
    if ($total > $maxTotal) respond(413, ['ok' => false, 'error' => 'Total size exceeded']);

    // Server-side MIME check
    $fi = new finfo(FILEINFO_MIME_TYPE);
    $mime = $fi->file($tmp) ?: '';
    if (!in_array($mime, $allowedMime, true)) {
      // Some servers may report unknown for AVIF; allow by extension fallback
      if (!($extension === 'avif' && ($mime === '' || $mime === 'application/octet-stream'))) {
        respond(415, ['ok' => false, 'error' => 'Unsupported MIME']);
      }
    }

    $filesInfo[] = [
      'tmp' => $tmp,
      'name' => $name,
      'mime' => $mime ?: ($extension === 'avif' ? 'image/avif' : 'application/octet-stream'),
      'size' => $size
    ];
    if (count($filesInfo) > $maxFiles) respond(422, ['ok' => false, 'error' => 'Too many files']);
  }
}

// ---- Mail Configuration
// SMTP ayarları (sunucu yapılandırmasına göre düzenleyin)
$useSMTP = false; // SMTP kullanmak için true yapın
$smtpHost = 'smtp.example.com'; // SMTP sunucu adresi
$smtpPort = 587; // SMTP portu (587 TLS, 465 SSL)
$smtpUser = ''; // SMTP kullanıcı adı
$smtpPass = ''; // SMTP şifresi
$smtpSecure = 'tls'; // 'tls' veya 'ssl'

$to = 'info@fethiyeninustasi.com.tr'; // Alıcı e-posta adresi
$subject = 'Yeni İletişim Talebi — FethiyeninUstası';
$subject = safeHeader($subject);
$from    = 'no-reply@fethiyeninustasi.com.tr';

$lines = [
  "Ad Soyad : $name",
  "Telefon  : $phone",
  "E-posta  : $email",
  "Bölge    : $area",
  "Hizmet   : $service",
  "Sayfa    : $page",
  "Zaman    : $t ($tz)",
  "----------------------------------------",
  $message
];
$textBody = implode("\n", $lines);

// Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'From: FethiyeninUstası <' . safeHeader($from) . '>';
$headers[] = 'Reply-To: ' . safeHeader($name) . ' <' . safeHeader($email) . '>';
$headers[] = 'X-Origin-IP: ' . safeHeader($ip);

$body = '';
if (!empty($filesInfo)) {
  // multipart/mixed with attachments
  $boundary = 'fu_mime_' . md5(uniqid('', true));
  $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

  $eol = "\r\n";
  $body .= '--' . $boundary . $eol;
  $body .= 'Content-Type: text/plain; charset=UTF-8' . $eol;
  $body .= 'Content-Transfer-Encoding: 8bit' . $eol . $eol;
  $body .= $textBody . $eol;

  foreach ($filesInfo as $fi) {
    $data = @file_get_contents($fi['tmp']);
    if ($data === false) continue;
    $b64 = chunk_split(base64_encode($data));

    // filename sanitize (ASCII only in header)
    $fname = preg_replace('/[^\x20-\x7E]/', '_', $fi['name']);
    $fname = str_replace(['"', '\\'], '_', $fname);

    $body .= '--' . $boundary . $eol;
    $body .= 'Content-Type: ' . $fi['mime'] . '; name="' . $fname . '"' . $eol;
    $body .= 'Content-Transfer-Encoding: base64' . $eol;
    $body .= 'Content-Disposition: attachment; filename="' . $fname . '"' . $eol . $eol;
    $body .= $b64 . $eol;
  }

  $body .= '--' . $boundary . '--' . $eol;
} else {
  // text/plain only
  $headers[] = 'Content-Type: text/plain; charset=UTF-8';
  $body = $textBody;
}

// Send mail via SMTP (if configured) or mail()
$ok = false;
$mailError = '';

// Basit SMTP fonksiyonu
function sendSMTP($host, $port, $user, $pass, $secure, $from, $to, $subject, $body, $headers) {
  $errno = 0;
  $errstr = '';
  
  $smtp = fsockopen(
    ($secure === 'ssl' ? 'ssl://' : '') . $host,
    $port,
    $errno,
    $errstr,
    30
  );
  
  if (!$smtp) {
    return "Connection failed: $errstr ($errno)";
  }
  
  $response = fgets($smtp, 515);
  if (substr($response, 0, 3) !== '220') {
    fclose($smtp);
    return "SMTP greeting failed: $response";
  }
  
  fputs($smtp, "EHLO " . $host . "\r\n");
  $response = fgets($smtp, 515);
  
  if ($secure === 'tls' && strpos($response, '250') !== false) {
    fputs($smtp, "STARTTLS\r\n");
    $response = fgets($smtp, 515);
    stream_socket_enable_crypto($smtp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    fputs($smtp, "EHLO " . $host . "\r\n");
    fgets($smtp, 515);
  }
  
  if ($user && $pass) {
    fputs($smtp, "AUTH LOGIN\r\n");
    fgets($smtp, 515);
    fputs($smtp, base64_encode($user) . "\r\n");
    fgets($smtp, 515);
    fputs($smtp, base64_encode($pass) . "\r\n");
    $response = fgets($smtp, 515);
    if (substr($response, 0, 3) !== '235') {
      fclose($smtp);
      return "SMTP auth failed: $response";
    }
  }
  
  fputs($smtp, "MAIL FROM: <$from>\r\n");
  fgets($smtp, 515);
  fputs($smtp, "RCPT TO: <$to>\r\n");
  fgets($smtp, 515);
  fputs($smtp, "DATA\r\n");
  fgets($smtp, 515);
  
  // Headers ekle
  fputs($smtp, "From: <$from>\r\n");
  fputs($smtp, "To: <$to>\r\n");
  fputs($smtp, "Subject: $subject\r\n");
  foreach ($headers as $h) {
    // Subject zaten eklendi, tekrar ekleme
    if (stripos($h, 'Subject:') === false) {
      fputs($smtp, "$h\r\n");
    }
  }
  fputs($smtp, "\r\n$body\r\n");
  fputs($smtp, ".\r\n");
  $response = fgets($smtp, 515);
  
  fputs($smtp, "QUIT\r\n");
  fclose($smtp);
  
  return substr($response, 0, 3) === '250' ? true : "SMTP send failed: $response";
}

try {
  if ($useSMTP && $smtpHost && $smtpUser && $smtpPass) {
    // SMTP kullan
    $result = sendSMTP($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpSecure, $from, $to, $subject, $body, $headers);
    if ($result === true) {
      $ok = true;
    } else {
      $mailError = is_string($result) ? $result : 'SMTP error';
      error_log("[contact.php] SMTP send failed: " . $mailError);
    }
  } else {
    // mail() fonksiyonunu kullan
    $ok = @mail($to, $subject, $body, implode("\r\n", $headers));
    
    if (!$ok) {
      $lastError = error_get_last();
      $mailError = ($lastError && isset($lastError['message'])) 
        ? $lastError['message'] 
        : 'mail() function returned false. Sunucu mail gönderimi desteklemiyor olabilir.';
      error_log("[contact.php] Mail send failed: " . $mailError);
      
      // Sunucu yapılandırmasını kontrol et
      if (function_exists('ini_get')) {
        $sendmail_path = ini_get('sendmail_path');
        if (empty($sendmail_path)) {
          $mailError .= ' (sendmail_path yapılandırılmamış)';
        }
      }
    }
  }
} catch (Exception $e) {
  $mailError = $e->getMessage();
  error_log("[contact.php] Mail exception: " . $mailError);
}

if ($ok) {
  // Log success (optional)
  error_log("[contact.php] Mail sent successfully to: " . $to);
  respond(200, ['ok' => true, 'message' => 'Mail sent successfully']);
}

// If mail failed, try to save to file as backup
$backupFile = __DIR__ . '/contact_backups/' . date('Y-m-d_His') . '_' . uniqid() . '.txt';
$backupDir = dirname($backupFile);
if (!is_dir($backupDir)) {
  @mkdir($backupDir, 0755, true);
}
if (is_dir($backupDir)) {
  $backupContent = "=== Contact Form Submission ===\n";
  $backupContent .= "Date: " . date('Y-m-d H:i:s') . "\n";
  $backupContent .= "IP: $ip\n";
  $backupContent .= "Name: $name\n";
  $backupContent .= "Email: $email\n";
  $backupContent .= "Phone: $phone\n";
  $backupContent .= "Area: $area\n";
  $backupContent .= "Service: $service\n";
  $backupContent .= "Message:\n$message\n";
  @file_put_contents($backupFile, $backupContent);
}

respond(500, [
  'ok' => false, 
  'error' => 'Mail gönderilemedi. Sistem yöneticisine bildirildi.',
  'debug' => $mailError ? 'Mail error: ' . $mailError : 'Unknown error'
]);
