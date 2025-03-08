// Slider Styling JS
let currentStep = 1;
const totalSteps = 5;
const stepTitles = [
    "Meet designer",
    "Book at Interia",
    "Place the order",
    "Execution and Installation",
    "Move in!"
];
const stepDescriptions = [
    "Let's get to know you better and we'll share design concepts and a quote",
    "Once you're happy with what we've proposed, pay 5% of the final quote",
    "Finalise the design, and your project is now off to a good start",
    "Manufacturing and installation happens as per design",
    "Your dream home is now a reality!"
];

function updateSlider(step) {
    // Update step numbers
    document.querySelectorAll('.step-number').forEach((el, index) => {
        if (index + 1 === step) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update content
    document.getElementById('d5-2-h1').textContent = stepTitles[step - 1];
    document.getElementById('d5-2-p').textContent = stepDescriptions[step - 1];

    // Update slides
    document.querySelectorAll('.slide').forEach((slide, index) => {
        if (index + 1 === step) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function clk1() {
    currentStep = 1;
    updateSlider(currentStep);
}

function clk2() {
    currentStep = 2;
    updateSlider(currentStep);
}

function clk3() {
    currentStep = 3;
    updateSlider(currentStep);
}

function clk4() {
    currentStep = 4;
    updateSlider(currentStep);
}

function clk5() {
    currentStep = 5;
    updateSlider(currentStep);
}

// Auto advance
function autoAdvance() {
    currentStep = currentStep % totalSteps + 1;
    updateSlider(currentStep);
}

// Start auto-advance when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateSlider(1); // Initialize first slide
    setInterval(autoAdvance, 4000); // Change slide every 4 seconds
});