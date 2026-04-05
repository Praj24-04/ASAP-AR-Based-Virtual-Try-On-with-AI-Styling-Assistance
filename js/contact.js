document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const header = document.getElementById('main-header');
    const contactForm = document.getElementById('contactForm');
    const formGroups = document.querySelectorAll('.form-group');
    const preloader = document.querySelector('.preloader');
    
    // Preloader handling
    if (preloader) {
        // Hide preloader when page is fully loaded
        window.addEventListener('load', function() {
            preloader.classList.add('hidden');
            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
        
        // Fallback if load event doesn't trigger
        setTimeout(function() {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
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
    
    // Form label animation
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        // Check if input has value on page load
        if (input.value) {
            label.classList.add('active');
        }
        
        // Add active class on focus
        input.addEventListener('focus', function() {
            label.classList.add('active');
        });
        
        // Remove active class on blur if no value
        input.addEventListener('blur', function() {
            if (!this.value) {
                label.classList.remove('active');
            }
        });
        
        // Add active class on input if value exists
        input.addEventListener('input', function() {
            if (this.value) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitButton = this.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showMessage('Message sent successfully!', 'success');
            
            // Reset form
            this.reset();
            formGroups.forEach(group => {
                const label = group.querySelector('label');
                label.classList.remove('active');
            });
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1500);
    });
    
    // Function to show messages
    function showMessage(message, type = 'success') {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        `;
        
        // Add to body
        document.body.appendChild(messageElement);
        
        // Show with animation
        setTimeout(() => {
            messageElement.classList.add('active');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            messageElement.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 