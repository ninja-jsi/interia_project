document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonial-slider');
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');

    let currentIndex = 0;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    // Initialize slider
    function initSlider() {
        if (!slider || !track || slides.length === 0) return;

        // Set track width
        track.style.width = `${slides.length * 100}%`;
        
        // Add event listeners for arrows
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                navigate('prev');
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                navigate('next');
            });
        }

        // Add event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Touch events
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchmove', touchMove);
        track.addEventListener('touchend', touchEnd);

        // Mouse events
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', touchEnd);
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (!isDragging) return;

        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;

        // Restrict sliding beyond first and last slides
        const minTranslate = -(slides.length - 1) * slider.offsetWidth;
        currentTranslate = Math.max(Math.min(currentTranslate, 0), minTranslate);

        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        isDragging = false;
        track.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        // If moved enough negative
        if (movedBy < -100 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        }

        // If moved enough positive
        if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        goToSlide(currentIndex);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function navigate(direction) {
        if (direction === 'prev' && currentIndex > 0) {
            currentIndex -= 1;
        } else if (direction === 'next' && currentIndex < slides.length - 1) {
            currentIndex += 1;
        }
        goToSlide(currentIndex);
    }

    function goToSlide(index) {
        currentIndex = index;
        prevTranslate = currentTranslate = -index * slider.offsetWidth;
        track.style.transform = `translateX(${currentTranslate}px)`;
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Auto slide every 5 seconds
    let autoSlideInterval;

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                navigate('next');
            } else {
                goToSlide(0);
            }
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Stop auto slide on hover or touch
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    slider.addEventListener('touchstart', stopAutoSlide);
    slider.addEventListener('touchend', startAutoSlide);

    // Initialize the slider
    initSlider();
    startAutoSlide();
}); 