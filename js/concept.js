document.addEventListener('DOMContentLoaded', function() {
    // Preloader handling
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('hidden');
        });
        
        // Fallback if load event doesn't trigger
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 3000);
    }

    // Header scroll effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll down button functionality
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            const nextSection = document.querySelector('.features-section');
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .perk-card, .tech-card').forEach(el => {
        observer.observe(el);
    });

    // Feature demo hover effect
    const demoContainers = document.querySelectorAll('.demo-container');
    demoContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.querySelector('.demo-overlay').style.opacity = '1';
            this.querySelector('.demo-overlay i').style.transform = 'scale(1)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.querySelector('.demo-overlay').style.opacity = '0';
            this.querySelector('.demo-overlay i').style.transform = 'scale(0.8)';
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.concept-hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }

    // Animated gradient background for sections
    const sections = document.querySelectorAll('.features-section, .perks-section, .tech-showcase');
    sections.forEach(section => {
        let gradientX = 0;
        let gradientY = 0;
        
        section.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            gradientX = ((e.clientX - rect.left) / rect.width) * 100;
            gradientY = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.style.setProperty('--gradient-x', `${gradientX}%`);
            this.style.setProperty('--gradient-y', `${gradientY}%`);
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

    // Add loading state to CTA button
    const ctaButton = document.querySelector('.cta-section .btn-try');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Simulate loading state
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = 'Start Trying On';
                window.location.href = 'try.html';
            }, 1500);
        });
    }

    // Add hover effect for feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
        document.querySelectorAll('.feature-card, .perk-card, .tech-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}); 