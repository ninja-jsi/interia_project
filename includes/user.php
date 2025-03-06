<?php
require 'config/config.php';

$new_hashed_password = password_hash("admin123", PASSWORD_DEFAULT);
$conn->query("UPDATE users SET password='$new_hashed_password' WHERE username='admin'");

echo "Password updated successfully!";
?>
