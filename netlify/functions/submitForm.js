// Initialize Supabase Client
const supabaseUrl = 'https://qzdnysgstmacdtuzglmw.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('myForm');
  const formMessageContainer = document.getElementById('form-message');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    formMessageContainer.textContent = '';

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const mobile = formData.get('mobile');
    const service = formData.get('service');
    const message = formData.get('message');

    // ✅ Validations
    if (!email.includes('@') || !email.includes('.')) {
      formMessageContainer.textContent = 'Please enter a valid email address.';
      formMessageContainer.style.color = 'red';
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile) || mobile[0] < '5') {
      formMessageContainer.textContent = 'Please enter a valid 10-digit phone number.';
      formMessageContainer.style.color = 'red';
      return;
    }

    if (!service || !message) {
      formMessageContainer.textContent = 'Please complete all required fields.';
      formMessageContainer.style.color = 'red';
      return;
    }

    try {
      // ✅ Save form data to Supabase
      const { data, error } = await supabase
        .from('user_quotes')
        .insert([{ name, email, mobile, service, message, created_at: new Date() }])
        .select();

      if (error) {
        formMessageContainer.textContent = 'DB Error: ' + error.message;
        formMessageContainer.style.color = 'red';
        return;
      }

      // ✅ Send Survey Link Email
      const response = await fetch("includes/sendSurveyLink.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });

      const result = await response.json();
      console.log("📩 Email Response:", result);

      if (result.success) {
        formMessageContainer.textContent = "Submission successful! Survey link sent to your email.";
        formMessageContainer.style.color = "green";
        form.reset();
      } else {
        formMessageContainer.textContent = "Error sending email: " + result.message;
        formMessageContainer.style.color = "red";
      }

    } catch (err) {
      console.error("❌ Unexpected error:", err.message);
      formMessageContainer.textContent = 'Unexpected error: ' + err.message;
      formMessageContainer.style.color = 'red';
    }
  });
});
