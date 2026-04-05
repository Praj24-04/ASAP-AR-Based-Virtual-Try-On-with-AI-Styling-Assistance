document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const header = document.getElementById('main-header');
    const arNotification = document.getElementById('ar-notification');
    const productCards = document.querySelectorAll('.product-card');
    const tryArButtons = document.querySelectorAll('.btn-try-ar');
    const startTryOnButton = document.querySelector('.instructions-cta .btn-try');
    
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
    
    // Track which products have been tried
    const triedProducts = new Set();
    
    // AR Try-on button functionality
    tryArButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lensId = this.getAttribute('data-lens-id');
            const lensUrl = this.getAttribute('data-lens-url');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-overlay h3').textContent;
            
            if (lensId && lensId !== 'TBD') {
                // Add to tried products
                triedProducts.add(lensId);
                
                // Show notification
                showArNotification();
                
                // Open the Snap Lens in a new tab after a short delay
                setTimeout(() => {
                    // Use the full lens URL if available, otherwise construct it
                    const url = lensUrl || `https://lens.snap.com/experience/${lensId}`;
                    window.open(url, '_blank');
                    
                    // Hide notification after a delay
                    setTimeout(() => {
                        hideArNotification();
                    }, 1000);
                }, 1000);
                
                // Add a "tried" badge to the product card if it doesn't exist
                if (!productCard.querySelector('.product-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'product-badge';
                    badge.textContent = 'Tried';
                    productCard.appendChild(badge);
                }
                
                // Track analytics
                trackArUsage(lensId, productName);
            } else {
                console.log("Lens ID not available for this product yet");
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
    document.querySelectorAll('.product-card, .step').forEach(el => {
        observer.observe(el);
    });
    
    // Add hover effect for product cards on touch devices
    if ('ontouchstart' in window) {
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
        
        // Enter key to trigger AR experience
        if (e.key === 'Enter' && document.activeElement.classList.contains('btn-try-ar')) {
            document.activeElement.click();
        }
    });
    
    // Add loading state to buttons
    tryArButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            // Reset button after delay
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-camera"></i> Try On';
            }, 2000);
        });
    });
    
    // Add smooth scroll for anchor links
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
    
    // Start Try On button click handler
    if (startTryOnButton) {
        startTryOnButton.addEventListener('click', function(e) {
            e.preventDefault();
            const productSelection = document.querySelector('.product-selection');
            if (productSelection) {
                window.scrollTo({
                    top: productSelection.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    }
});