// Initialize Supabase Client
const supabaseUrl = 'https://qzdnysgstmacdtuzglmw.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// When the page loads
window.addEventListener('load', async function () {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const ipData = await res.json();

    const parser = new UAParser();
    const result = parser.getResult();

    const browser = result.browser.name || 'Unknown';
    const os = result.os.name || 'Unknown';
    const deviceRaw = result.device.type || 'desktop';
    const device = deviceRaw.charAt(0).toUpperCase() + deviceRaw.slice(1);

    const { data, error } = await supabase.from('visits').insert([{
      timestamp: new Date().toISOString(),
      ip_address: ipData.ip,
      location: JSON.stringify({
        country: ipData.country_name,
        region: ipData.region,
        city: ipData.city,
        org: ipData.org
      }),
      browser,
      os,
      device,
      page: window.location.pathname
    }]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
    } else {
      console.log("✅ Visit tracked successfully:", data);
    }
  } catch (err) {
    console.error("❌ Error in visitor tracking:", err.message);
  }
});
