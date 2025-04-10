<?php
header('Content-type: application/json');

// Collect form data with defaults for optional fields
$name = isset($_POST['name']) ? strip_tags(htmlspecialchars($_POST['name'])) : 'Anonymous';
$email = isset($_POST['email']) ? strip_tags(htmlspecialchars($_POST['email'])) : '';
$subject = isset($_POST['subject']) ? strip_tags(htmlspecialchars($_POST['subject'])) : 'No Subject';
$message = isset($_POST['message']) ? strip_tags(htmlspecialchars($_POST['message'])) : 'No Message';

// Validate email (required for all forms)
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid email address']);
    exit;
}

// Additional validation for email to prevent header injection
if (preg_match("/[\r\n]/", $email)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid email format']);
    exit;
}

$to = "dorothymarthanamutamba@gmail.com"; // ZACON's email
$email_subject = "$subject: $name";
$body = "You have received a new message from the ZACON website.\n\n".
        "Here are the details:\n\n".
        "Name: $name\n".
        "Email: $email\n".
        "Subject: $subject\n".
        "Message: $message\n";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email
if (mail($to, $email_subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(['message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to send message']);
}
?>