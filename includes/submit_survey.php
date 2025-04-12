<?php
// Enable CORS and set content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Supabase API details
$SUPABASE_URL = 'https://qzdnysgstmacdtuzglmw.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';
$TABLE_NAME = 'survey_responses';

// Check if POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Capture incoming fields
    $email = $_POST['email'] ?? '';
    $property_details = $_POST['property_details'] ?? '';
    $home_configuration = $_POST['home_configuration'] ?? '';
    $home_size = $_POST['home_size'] ?? '';
    $scope_of_work = $_POST['scope_of_work'] ?? '';
    $package = $_POST['package'] ?? '';
    $custom_modules = $_POST['custom_modules'] ?? '';
    $budget = $_POST['budget'] ?? '';

    // Log all received data
    error_log("Received POST data:");
    error_log("Email: $email");
    error_log("Property Details: $property_details");
    error_log("Home Configuration: $home_configuration");
    error_log("Home Size: $home_size");
    error_log("Scope of Work: $scope_of_work");
    error_log("Package: $package");
    error_log("Budget: $budget");
    error_log("Custom Modules: $custom_modules");

    // Check for missing fields
    $missing_fields = [];
    if (!$email) $missing_fields[] = 'email';
    if (!$property_details) $missing_fields[] = 'property_details';
    if (!$home_configuration) $missing_fields[] = 'home_configuration';
    if (!$home_size) $missing_fields[] = 'home_size';
    if (!$scope_of_work) $missing_fields[] = 'scope_of_work';
    if (!$package) $missing_fields[] = 'package';
    if (!$budget) $missing_fields[] = 'budget';

    if (!empty($missing_fields)) {
        error_log("Missing fields: " . implode(', ', $missing_fields));
        echo json_encode(["success" => false, "message" => "Missing required fields", "missing" => $missing_fields]);
        exit;
    }

    // Check if email exists in user_quotes table
    $checkUrl = "$SUPABASE_URL/rest/v1/user_quotes?email=eq.$email";
    $checkHeaders = [
        "Authorization: Bearer $SUPABASE_ANON_KEY",
        "apikey: $SUPABASE_ANON_KEY",
        "Content-Type: application/json"
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $checkUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $checkHeaders);
    $response = curl_exec($ch);

    // Log the response to check if email exists
    if ($response === false) {
        error_log("Error while checking email in user_quotes: " . curl_error($ch));
        echo json_encode(["success" => false, "message" => "Error checking email in user_quotes"]);
        exit;
    }

    error_log("Response from Supabase (user_quotes check): " . $response);
    curl_close($ch);

    $checkData = json_decode($response, true);
    if (empty($checkData)) {
        error_log("Email not found in user_quotes: $email");
        echo json_encode(["success" => false, "message" => "Email not found in user_quotes"]);
        exit;
    }

    // Insert into survey_responses
    $insertUrl = "$SUPABASE_URL/rest/v1/$TABLE_NAME";
    $insertData = json_encode([
        'email' => $email,
        'property_details' => $property_details,
        'home_configuration' => $home_configuration,
        'home_size' => $home_size,
        'scope_of_work' => $scope_of_work,
        'package' => $package,
        'custom_modules' => $custom_modules,
        'budget' => $budget
    ]);

    // Log the data that is going to Supabase
    error_log("Sending data to Supabase (survey_responses insert): " . $insertData);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $insertUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $checkHeaders);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $insertData);
    $response = curl_exec($ch);

    // Log if insert failed or succeeded
    if ($response === false) {
        error_log("Error inserting data into survey_responses: " . curl_error($ch));
        echo json_encode(["success" => false, "message" => "Error inserting data into survey_responses"]);
        exit;
    }

    error_log("Insert response from Supabase: " . $response); // Log the full response

    $insertResponse = json_decode($response, true);
    if ($insertResponse) {
        error_log("Survey submitted successfully for $email");
        echo json_encode(["success" => true, "message" => "Survey submitted successfully"]);
    } else {
        error_log("Insert response error: " . $response);
        echo json_encode(["success" => false, "message" => "Error inserting data into survey_responses"]);
    }

} else {
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
