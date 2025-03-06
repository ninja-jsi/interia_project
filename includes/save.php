<?php
require '../config/config.php'; // Ensure this file correctly connects to your database


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize input
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
    $service = isset($_POST['service']) ? trim($_POST['service']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Check if any field is empty
    if (empty($name) || empty($email) || empty($mobile) || empty($service) || empty($message)) {
        die("❌ Error: All fields are required.");
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("❌ Error: Please enter a valid email address.");
    }

    // Validate mobile number (only 10 digits)
    if (!preg_match("/^[0-9]{10}$/", $mobile)) {
        die("❌ Error: Please enter a valid 10-digit mobile number.");
    }

    // Validate service type
    $valid_services = ['residential', 'commercial', 'renovation'];
    if (!in_array($service, $valid_services)) {
        die("❌ Error: Invalid service type selected.");
    }

    // ✅ Corrected: Use a prepared statement to prevent SQL injection
    $sql = "INSERT INTO user_quotes (name, email, mobile, service_type, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sssss", $name, $email, $mobile, $service, $message);
        
        if ($stmt->execute()) {
            echo "✅ Thank you! Your quote request has been submitted successfully.";
        } else {
            throw new Exception($stmt->error);
        }

        $stmt->close(); // Close the statement
    } else {
        echo "❌ Error: Unable to prepare statement.";
    }

    $conn->close(); // ✅ Close the database connection after executing the query
}
?>
