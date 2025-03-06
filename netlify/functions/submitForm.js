// Initialize Supabase Client
const supabaseUrl = 'https://qzdnysgstmacdtuzglmw.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM'; // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Handle form submission
document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear previous messages
    document.getElementById('form-message').textContent = '';

    // Get form field values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value;

    // Validate Email
    if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('form-message').textContent = 'Please enter a valid email address.';
        return;
    }

    // Validate Mobile Number (10 digits, starts with 7-9)
    if (mobile.length !== 10 || isNaN(mobile) || mobile.slice(0, 1) < 7 || mobile.slice(0, 1) > 9) {
        document.getElementById('form-message').textContent = 'Please enter a valid 10-digit phone number that starts with 7, 8, or 9.';
        return;
    }

    // Validate Service Type and Message
    if (!service) {
        document.getElementById('form-message').textContent = 'Please select a service type.';
        return;
    }

    if (!message) {
        document.getElementById('form-message').textContent = 'Please enter your message.';
        return;
    }

    // Insert data into Supabase
    const { data, error } = await supabase
        .from('form_submissions')  // The table name you created in Supabase
        .insert([
            {
                name: name,
                email: email,
                mobile: mobile,
                service: service,
                message: message,
                created_at: new Date(),
            }
        ]);

    // Handle response
    if (error) {
        document.getElementById('form-message').textContent = 'Error: ' + error.message;
    } else {
        document.getElementById('form-message').textContent = 'Form submitted successfully!';
        document.getElementById("myForm").reset(); // Reset the form
    }
});
