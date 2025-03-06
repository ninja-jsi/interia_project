<?php
// login.php - The login form page
session_start();

// Check if already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div class="login-container">
        <h2>Login</h2>
        
        <?php
        // Display error message if it exists
        if (isset($_SESSION['error'])) {
            echo '<div class="error-message">' . $_SESSION['error'] . '</div>';
            unset($_SESSION['error']); // Clear the error message
        }
        ?>
        
        <form action="includes/authenticate.php" method="POST">
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn">Login</button>
        </form>
    </div>
</body>
</html>