<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['access_token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Supabase configuration
const SUPABASE_URL = 'https://qzdnysgstmacdtuzglmw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';

// Get sort parameters
$valid_fields = ['created_at', 'name', 'email', 'service'];
$sort_by = isset($_GET['sort']) && in_array($_GET['sort'], $valid_fields) ? $_GET['sort'] : 'created_at';
$order = isset($_GET['order']) && strtolower($_GET['order']) === 'asc' ? 'asc' : 'desc';

try {
    // Fetch quotes from Supabase
    $url = SUPABASE_URL . '/rest/v1/user_quotes?select=*&order=' . $sort_by . '.' . $order;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_ANON_KEY,
        'Authorization: Bearer ' . $_SESSION['access_token']
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        throw new Exception('Curl error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    if ($http_code !== 200) {
        throw new Exception('Failed to fetch quotes. Status code: ' . $http_code);
    }

    $quotes = json_decode($response, true);
    
    if (!is_array($quotes)) {
        throw new Exception('Invalid response format');
    }

    echo json_encode([
        'success' => true,
        'data' => $quotes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
} 