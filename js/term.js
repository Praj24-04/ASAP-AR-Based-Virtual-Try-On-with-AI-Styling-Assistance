// Initialize variables
const header = document.querySelector('header');
const preloader = document.querySelector('.preloader');
const termsBlocks = document.querySelectorAll('.terms-block');
const scrollDownBtn = document.querySelector('.scroll-down');

// Handle preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Fallback for preloader
setTimeout(() => {
    if (preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}, 3000);

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll down button functionality
if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
        const termsSection = document.querySelector('.terms-section');
        if (termsSection) {
            window.scrollTo({
                top: termsSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
}

// Intersection Observer for terms blocks animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe each terms block
termsBlocks.forEach(block => {
    observer.observe(block);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Tab key navigation
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift + Tab
            if (currentIndex > 0) {
                focusableElements[currentIndex - 1].focus();
            } else {
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab
            if (currentIndex < focusableElements.length - 1) {
                focusableElements[currentIndex + 1].focus();
            } else {
                focusableElements[0].focus();
            }
        }
    }
});

// Add hover effect for terms blocks
termsBlocks.forEach(block => {
    block.addEventListener('mouseenter', () => {
        block.style.transform = 'translateY(-5px)';
    });
    
    block.addEventListener('mouseleave', () => {
        block.style.transform = 'translateY(0)';
    });
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${progress}%`;
}); 