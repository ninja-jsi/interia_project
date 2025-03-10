<?php
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Check if email and password are provided
if (empty($_POST['email']) || empty($_POST['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit();
}

// Supabase configuration
const SUPABASE_URL = 'https://qzdnysgstmacdtuzglmw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';

$email = $_POST['email'];
$password = $_POST['password'];

try {
    // Sign in with Supabase
    $ch = curl_init(SUPABASE_URL . '/auth/v1/token?grant_type=password');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_ANON_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'email' => $email,
        'password' => $password
    ]));

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        throw new Exception('Curl error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    if ($http_code !== 200) {
        throw new Exception('Invalid credentials');
    }

    $data = json_decode($response, true);
    
    if (!$data || !isset($data['access_token']) || !isset($data['user']['id'])) {
        throw new Exception('Invalid response from server');
    }

    // Set session variables
    $_SESSION['user_id'] = $data['user']['id'];
    $_SESSION['email'] = $data['user']['email'];
    $_SESSION['access_token'] = $data['access_token'];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful'
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?>
