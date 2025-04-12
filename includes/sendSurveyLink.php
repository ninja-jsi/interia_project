<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';
require '../PHPMailer/src/Exception.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';

// ✅ Basic input validation
if (!$name || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// ✅ Dynamic survey link based on current domain
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$surveyLink = $protocol . $host . "/survey?email=" . urlencode($email);
$imageUrl1 = $protocol . $host . "/images/logo.png";
$imageUrl2 = $protocol . $host . "/images/Polar_bear.png";

$mail = new PHPMailer(true);

try {
    // ✅ Gmail SMTP configuration
    $mail->isSMTP();
    $mail->Host = 'smtp-relay.brevo.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'jackxstreaming@gmail.com'; // ✅ Your Gmail address
    $mail->Password = 's4BJO0G5qDf2WAQa';   // ✅ App password if 2FA enabled
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('jackxstreaming@gmail.com', 'Interio Studio'); // ✅ Sender must match Gmail account
    $mail->addAddress($email, $name);

    $mail->isHTML(true); // Set to true if sending HTML email
    $mail->Subject = "Hi $name, We've received your submission!";
    // $mail->Body = "Hi $name,\n\nThanks for reaching out!\nPlease complete this quick survey:\n\n$surveyLink\n\nCheers,\nYour Company";
    $htmlTemplate = file_get_contents('../new-email.html');

    // Replace placeholders in the template
    $htmlBody = str_replace(
        ['{{name}}', '{{survey_link}}', '{{image_url_1}}', '{{image_url_2}}'],
        [$name, $surveyLink, $imageUrl1, $imageUrl2],
        $htmlTemplate
    );

    $mail->Body = $htmlBody;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Survey email sent successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error sending email: ' . $mail->ErrorInfo]);
}
