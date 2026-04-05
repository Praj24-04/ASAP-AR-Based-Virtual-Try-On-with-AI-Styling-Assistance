// JavaScript for header scroll effect, smooth scrolling, and AR functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const arNotification = document.getElementById('ar-notification');
    const experienceTitle = document.querySelector('.experience-title');
    const tryOnButton = document.querySelector('.btn-try-on');
    const experienceSlide = document.querySelector('.experience-slide');
    
    // Preloader
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
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for anchor links and scroll down buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll down button functionality
    const scrollDownBtns = document.querySelectorAll('.scroll-down');
    scrollDownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentSection = this.closest('section');
            const nextSection = parentSection.nextElementSibling;
            
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // AR functionality
    const tryArButtons = document.querySelectorAll('.btn-try-ar');
    
    // Track which products have been tried
    const triedProducts = new Set();
    
    tryArButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lensId = this.getAttribute('data-lens-id');
            const lensUrl = this.getAttribute('data-lens-url');
            
            if (lensUrl && lensUrl !== '#') {
                // Add to tried products
                triedProducts.add(lensId);
                
                // Show notification
                showArNotification();
                
                // Open the Snap Lens in a new tab after a short delay
                setTimeout(() => {
                    window.open(lensUrl, '_blank');
                    
                    // Hide notification after a delay
                    setTimeout(() => {
                        hideArNotification();
                    }, 1000);
                }, 1000);
                
                // Add a "tried" badge to the product card if it doesn't exist
                const productCard = this.closest('.product-card');
                if (productCard && !productCard.querySelector('.product-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'product-badge';
                    badge.textContent = 'Tried';
                    productCard.appendChild(badge);
                }
            } else {
                console.log("Lens URL not available for this product yet");
                
                // Show a temporary message for products without lens URLs
                showTemporaryMessage("This AR experience is coming soon!");
            }
        });
    });
    
    // Function to show AR notification
    function showArNotification() {
        arNotification.classList.add('active');
    }
    
    // Function to hide AR notification
    function hideArNotification() {
        arNotification.classList.remove('active');
    }
    
    // Function to show temporary message
    function showTemporaryMessage(message) {
        // Create temporary message element
        const tempMessage = document.createElement('div');
        tempMessage.className = 'temp-message';
        tempMessage.innerHTML = `
            <div class="temp-message-content">
                <i class="fas fa-info-circle"></i>
                <p>${message}</p>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(tempMessage);
        
        // Show with animation
        setTimeout(() => {
            tempMessage.classList.add('active');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            tempMessage.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(tempMessage);
            }, 300);
        }, 3000);
    }
    
    // Mobile detection for better AR experience
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
    
    // Add mobile-specific classes if on mobile
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
        
        // Add a message for mobile users about better AR experience
        if (window.sessionStorage && !sessionStorage.getItem('arMessageShown')) {
            setTimeout(() => {
                showTemporaryMessage("For the best AR experience, use your mobile device");
                sessionStorage.setItem('arMessageShown', 'true');
            }, 2000);
        }
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
    
    // Observe elements with animation classes
    document.querySelectorAll('.ar-title, .ar-description, .btn-learn-more, .phone-container, .section-title, .product-card, .footer-content').forEach(el => {
        observer.observe(el);
    });
    
    // Experience slide animations
    if (experienceSlide && experienceTitle && tryOnButton) {
        // Add entrance animations when the slide comes into view
        const experienceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    experienceTitle.style.opacity = '1';
                    experienceTitle.style.transform = 'translateY(0)';
                    
                    setTimeout(() => {
                        tryOnButton.style.opacity = '1';
                        tryOnButton.style.transform = 'translateY(0)';
                    }, 500);
                    
                    // Animate floating shapes
                    document.querySelectorAll('.shape').forEach(shape => {
                        shape.style.opacity = '1';
                    });
                    
                    experienceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        experienceObserver.observe(experienceSlide);
        
        // Initialize with elements hidden
        experienceTitle.style.opacity = '0';
        experienceTitle.style.transform = 'translateY(-50px)';
        tryOnButton.style.opacity = '0';
        tryOnButton.style.transform = 'translateY(50px)';
        
        // Hide shapes initially
        document.querySelectorAll('.shape').forEach(shape => {
            shape.style.opacity = '0';
            shape.style.transition = 'opacity 1.5s ease';
        });
        
        // Add interactive hover effect for the experience title
        experienceTitle.addEventListener('mousemove', (e) => {
            const rect = experienceTitle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            experienceTitle.style.setProperty('--x', `${x}px`);
            experienceTitle.style.setProperty('--y', `${y}px`);
        });
        
        // Add click animation for the try-on button
        tryOnButton.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            ripple.classList.add('active');
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    // Add hover effect for product cards on touch devices
    if ('ontouchstart' in window) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                // Remove active class from all cards
                productCards.forEach(c => c.classList.remove('touch-active'));
                // Add active class to current card
                this.classList.add('touch-active');
            });
        });
        
        // Close touch active state when touching elsewhere
        document.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.product-card')) {
                productCards.forEach(c => c.classList.remove('touch-active'));
            }
        });
    }
    
    // Track analytics for AR usage
    function trackArUsage(lensId, productName) {
        // This is a placeholder for actual analytics tracking
        // In a real implementation, you would send this data to your analytics service
        console.log(`AR Experience launched: ${productName} (${lensId})`);
        
        // Example of what you might do with a real analytics service:
        // if (typeof gtag === 'function') {
        //     gtag('event', 'ar_experience', {
        //         'lens_id': lensId,
        //         'product_name': productName
        //     });
        // }
    }
    
    // Add event listeners to track AR usage
    tryArButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lensId = this.getAttribute('data-lens-id');
            const productElement = this.closest('.product-overlay').querySelector('.product-title');
            
            if (productElement && lensId && lensId !== '#') {
                const productName = productElement.textContent;
                trackArUsage(lensId, productName);
            }
        });
    });
    
    // Add scroll animations for the shapes
    window.addEventListener('scroll', () => {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.05 + (index * 0.01);
            const yPos = window.scrollY * speed;
            shape.style.transform = `translateY(${yPos}px) rotate(${yPos / 10}deg)`;
        });
    });
    
    // Footer animations
    const footerLinks = document.querySelectorAll('.footer-links-column ul li');
    footerLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        link.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
    });
    
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const links = entry.target.querySelectorAll('ul li');
                links.forEach(link => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                });
                footerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.footer-links-column').forEach(column => {
        footerObserver.observe(column);
    });
    
    // Handle errors gracefully
    window.addEventListener('error', function(e) {
        console.error('Error occurred:', e.error);
        // Prevent the error from breaking the user experience
        // Only show error to user if it's critical
        if (e.error && e.error.message && e.error.message.includes('critical')) {
            showTemporaryMessage('Something went wrong. Please try again later.');
        }
        return true; // Prevents the default error handling
    });
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // Arrow down or Page Down to scroll to next section
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            const sections = document.querySelectorAll('section');
            const currentSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });
            
            if (currentSection) {
                const nextSection = currentSection.nextElementSibling;
                if (nextSection) {
                    window.scrollTo({
                        top: nextSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
        
        // Arrow up or Page Up to scroll to previous section
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            const sections = document.querySelectorAll('section');
            const currentSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });
            
            if (currentSection) {
                const prevSection = currentSection.previousElementSibling;
                if (prevSection) {
                    window.scrollTo({
                        top: prevSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });

    // Handle video loading
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('loadeddata', function() {
            this.classList.add('loaded');
        });
        
        video.addEventListener('error', function(e) {
            console.error('Error loading video:', e);
            // Fallback to image if video fails to load
            const fallbackImage = document.createElement('img');
            fallbackImage.src = 'images/fallback-image.jpg';
            fallbackImage.alt = 'Fashion showcase';
            this.parentNode.replaceChild(fallbackImage, this);
        });
    });
});
