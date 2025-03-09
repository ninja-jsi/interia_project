<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['access_token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Check if it's a POST request with quote IDs
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST['ids'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Supabase configuration
const SUPABASE_URL = 'https://qzdnysgstmacdtuzglmw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';

try {
    // Get quote IDs from POST data
    $quoteIds = json_decode($_POST['ids']);
    
    if (!is_array($quoteIds)) {
        throw new Exception('Invalid quote IDs');
    }

    // Delete quotes from Supabase
    $url = SUPABASE_URL . '/rest/v1/user_quotes?id=in.(' . implode(',', $quoteIds) . ')';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_ANON_KEY,
        'Authorization: Bearer ' . $_SESSION['access_token'],
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        throw new Exception('Curl error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    if ($http_code !== 204) {
        throw new Exception('Failed to delete quotes. Status code: ' . $http_code);
    }

    echo json_encode(['success' => true, 'message' => count($quoteIds) . ' quote(s) deleted successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 