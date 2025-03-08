// Initialize Supabase Client
const supabaseUrl = 'https://qzdnysgstmacdtuzglmw.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM'; // Replace with your Supabase anon key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const formMessageContainer = document.getElementById('form-message');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      // To Clear previous messages
      formMessageContainer.textContent = '';
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const mobile = formData.get('mobile');
      const service = formData.get('service');
      const message = formData.get('message');
  
      if (!email.includes('@') || !email.includes('.')) {
        formMessageContainer.textContent = 'Please enter a valid email address.';
        formMessageContainer.style.color = 'red'; 
        return;
      }
  
      if (mobile.length !== 10 || isNaN(mobile) || mobile.slice(0, 1) < 7 || mobile.slice(0, 1) > 9) {
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
        const { data, error } = await supabase
          .from('user_quotes')
          .insert([{ name, email, mobile, service, message, created_at: new Date() }])
          .select();
  
        if (error) {
          formMessageContainer.textContent = 'DB Error: ' + error.message;
          formMessageContainer.style.color = 'red';
          return;
        }
  
        formMessageContainer.textContent = 'Form submitted Successfully!';
        formMessageContainer.style.color = 'green';
        form.reset();        
      } catch (err) {
        formMessageContainer.textContent = 'Unexpected error occurred: ' + err.message;
        formMessageContainer.style.color = 'red';
      }
    });
  });
