<?php
// authenticate.php - Processes the login form
session_start();
require_once '../config/config.php';

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']); // Trim whitespace
    $password = $_POST['password'];

    // Validate input
    if (empty($username) || empty($password)) {
        $_SESSION['error'] = "Username and password are required.";
        header("Location: ../login.php");
        exit();
    }

    // Prepare SQL statement to prevent SQL injection
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Verify password
        if (password_verify($password, $user['password'])) {
            // Password is correct, create session
            session_regenerate_id(true); // Prevent session fixation
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            // Redirect to dashboard
            header("Location: ../dashboard.php");
            exit();
        } else {
            // Password is incorrect
            $_SESSION['error'] = "Incorrect username or password.";
            header("Location: ../login.php");
            exit();
        }
    } else {
        // Username not found
        $_SESSION['error'] = "Incorrect username or password.";
        header("Location: ../login.php");
        exit();
    }

    $stmt->close();
} else {
    // Redirect if someone tries to access this page directly
    header("Location: ../login.php");
    exit();
}
?>