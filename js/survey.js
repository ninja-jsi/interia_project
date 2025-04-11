let currentStep = 0;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const range = document.getElementById("areaRange");
const rangeValue = document.getElementById("rangeValue");
const answers = {};

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle("active", i === index));
  backBtn.disabled = index === 0;
  nextBtn.textContent = index === steps.length - 2 ? "Finish" : (index === steps.length - 1 ? "Submit" : "Next");
  progress.style.width = `${(index / (steps.length - 1)) * 100}%`;

  // Rebind click listeners
  document.querySelectorAll(".option, .package-option").forEach(el => {
    el.onclick = () => {
      el.parentElement.querySelectorAll(".option, .package-option").forEach(opt => opt.classList.remove("selected"));
      el.classList.add("selected");
    };
  });
}

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
    alert("Thank you! Your form is complete.");
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

range?.addEventListener("input", () => {
  rangeValue.textContent = `${range.value} sq.ft`;
});

showStep(currentStep);



const sizeImage = document.getElementById("sizeImage");

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

range.addEventListener("input", () => {
  const roundedValue = Math.round(range.value / 500) * 500;
  rangeValue.textContent = `${range.value} sq.ft`;
  if (imageMap[roundedValue]) {
    sizeImage.src = imageMap[roundedValue];
  }
});





  // Package selection
  const packageOptions = document.querySelectorAll('.package-option');
  const customModules = document.getElementById('customModules');

  packageOptions.forEach(option => {
    option.addEventListener('click', () => {
      packageOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      if (option.dataset.value === 'others') {
        customModules.style.display = 'block';
      } else {
        customModules.style.display = 'none';
      }
    });

    // Image slider for each package
    const slides = option.querySelectorAll('.slide');
    let currentSlide = 0;
    setInterval(() => {
      if (!option.classList.contains('selected')) return;

      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 3000); // Every 3 seconds
  });


    // Auto slide functionality
    document.querySelectorAll('.slider').forEach(slider => {
        let slides = slider.querySelectorAll('.slide');
        let index = 0;
        setInterval(() => {
          slides[index].classList.remove('active');
          index = (index + 1) % slides.length;
          slides[index].classList.add('active');
        }, 3000);
      });
    
      // Selection handling
      document.querySelectorAll('.package-option').forEach(option => {
        option.addEventListener('click', () => {
          document.querySelectorAll('.package-option').forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
        });
      });