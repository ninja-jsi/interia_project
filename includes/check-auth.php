<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id']) && isset($_SESSION['access_token']) && isset($_SESSION['email'])) {
    echo json_encode([
        'authenticated' => true,
        'email' => $_SESSION['email']
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
} 