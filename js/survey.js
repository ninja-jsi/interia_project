document.addEventListener("DOMContentLoaded", function() {
  // Define important variables
  let currentStep = 0;
  const steps = document.querySelectorAll(".step");
  const progress = document.getElementById("progressBar");
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const range = document.getElementById("areaRange");
  const rangeValue = document.getElementById("rangeValue");
  const sizeImage = document.getElementById("sizeImage");
  const packageOptions = document.querySelectorAll('.package-option');
  const customModules = document.getElementById('customModules');
  const answers = {};
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  
  // Image map for range selections
  const imageMap = {
    500: "https://images.wondershare.com/edrawmax/templates/500-sq-ft-2-bedroom-house-plan.png",
    1000: "https://images.wondershare.com/edrawmax/templates/1000-sq-ft-floor-plan.png",
    1500: "https://images.wondershare.com/edrawmax/templates/1500-sq-ft-floor-plan.png",
    2000: "https://i.pinimg.com/736x/53/76/fc/5376fc60d4ee9f8f541d9902c35bd13c.jpg",
    2500: "https://i.pinimg.com/564x/45/0c/a2/450ca2e98488ec70ce2f383bd24d817d.jpg",
    3000: "https://thumb.cadbull.com/img/product_img/original/3000SqFt4BHKHousePlanDesignDWGFileWedFeb2020125216.jpg",
    3500: "https://fpg.roomsketcher.com/image/level/1669/2d/3500-sq-ft-2d-house-plan.jpg",
    4000: "https://wpmedia.roomsketcher.com/content/uploads/2022/05/10134842/Office-Floor-Plan-2D-With-Labels-Black-and-White.jpg",
    4500: "https://i.pinimg.com/736x/fe/86/e7/fe86e7c0fd5c350697daffa26b4e950d.jpg",
    5000: "https://i.pinimg.com/736x/f1/45/63/f14563410f2b3940a3354f0541605e66.jpg"
  };

  // Show the correct step
  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
    backBtn.disabled = index === 0;
    nextBtn.textContent = index === steps.length - 2 ? "Finish" : (index === steps.length - 1 ? "Submit" : "Next");
    progress.style.width = `${(index / (steps.length - 1)) * 100}%`;

    // Rebind click listeners for selections
    document.querySelectorAll(".option, .package-option").forEach(el => {
      el.onclick = () => handleOptionSelection(el);
    });
  }

  // Handle option selection (single choice or multiple)
  function handleOptionSelection(el) {
    el.parentElement.querySelectorAll(".option, .package-option").forEach(opt => opt.classList.remove("selected"));
    el.classList.add("selected");
  }

  // Update range value display
  function updateRangeDisplay() {
    const roundedValue = Math.round(range.value / 500) * 500;
    rangeValue.textContent = `${range.value} sq.ft`;
    if (imageMap[roundedValue]) {
      sizeImage.src = imageMap[roundedValue];
    }
  }

  // Save selected values and move to the next step
  function nextStep() {
    const current = steps[currentStep];
    const selected = current.querySelector(".option.selected, .package-option.selected");

    if (current.querySelector(".option, .package-option") && !selected && currentStep < steps.length - 1) {
      alert("Please select an option to continue.");
      return;
    }

    if (range && current.contains(range)) {
      answers[`step${currentStep}`] = range.value;
    } else if (selected) {
      answers[`step${currentStep}`] = selected.dataset.value;
    }

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      // submitForm();
      if (currentStep >= steps.length - 1) {
        console.log("📦 Collected Answers:", answers);
      
        const stepLabels = {
          step0: "Property Type",
          step1: "Scope of Work",
          step2: "Area Size",
          step3: "Budget",
          step4: "Timeline",
          step5: "Design Package"
          // Add more steps here as needed
        };
      
        // Check for missing fields
        let hasMissingFields = false;
        Object.keys(stepLabels).forEach(key => {
          if (!answers[key]) {
            console.warn(`⚠️ Missing value for: ${stepLabels[key]}`);
            hasMissingFields = true;
          }
        });
      
        if (hasMissingFields) {
          alert("Please fill in all required fields before submitting.");
          return; // Prevent submission
        }
      
        submitForm();
        return;
      }      
    }
  }

  // Go to previous step
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }


  // Handle package selection and images slider
  function handlePackageSelection() {
    packageOptions.forEach(option => {
      option.addEventListener('click', () => {
        packageOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');

        // Show/hide custom modules based on selection
        if (option.dataset.value === 'others') {
          customModules.style.display = 'block';
        } else {
          customModules.style.display = 'none';
        }

        handleImageSlider(option);
      });
    });
  }

  // Image slider for each package
  function handleImageSlider(option) {
    const slides = option.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Clear any previous interval (stop old sliders)
    if (option._sliderInterval) {
      clearInterval(option._sliderInterval);
    }

    // Start a new interval for the selected package
    option._sliderInterval = setInterval(() => {
      if (!option.classList.contains('selected')) return;

      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 3000); // Change slide every 3 seconds
  }

  // Initially, select the first package (Essentials Package)
  document.addEventListener('DOMContentLoaded', () => {
    const firstPackage = document.querySelector('.package-option');
    if (firstPackage) {
      firstPackage.classList.add('selected');
      handleImageSlider(firstPackage); // Start the image slider for the first package
    }

    // Initialize package selection
    handlePackageSelection();
  });


  function submitForm() {
    const supabaseUrl = 'https://qzdnysgstmacdtuzglmw.supabase.co'; 
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';
    const table = "survey_responses";

    const email = urlParams.get('email');
    console.log("Email extracted from URL:", email);  
    // Print answers for debugging
    console.log("Collected answers:", answers);
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("property_details", answers.step0);
    formData.append("home_configuration", answers.step1);
    formData.append("home_size", answers.step2);
    formData.append("scope_of_work", answers.step3);
    formData.append("budget", answers.step4);
    formData.append("package", answers.step5);
    formData.append("custom_modules", answers.customModules || "");
  
    const parseOrNull = val => isNaN(Number(val)) ? null : Number(val);

    const payload = {
      email: email,
      property_details: answers.step0,
      home_configuration: answers.step1,
      home_size: answers.step2,    // ensure numeric
      scope_of_work: answers.step3,
      budget: answers.step4,       // ensure numeric
      package: answers.step5,
      custom_modules: answers.customModules || ""
    };
  
    console.log("Submitting to Supabase:", payload);
  
    fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }
        alert("Thank you! Your form has been submitted.");
      })
      .catch(err => {
        console.error("🛑 Submission error:", err);
        alert("Error submitting form: " + err.message);
      });
    
  }
  

  // Initialize
  showStep(currentStep);
  range.addEventListener("input", updateRangeDisplay);
  handlePackageSelection();

  nextBtn.addEventListener("click", nextStep);
  backBtn.addEventListener("click", prevStep);
});
