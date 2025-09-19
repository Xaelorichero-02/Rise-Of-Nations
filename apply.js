document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Form handling
    const applicationForm = document.getElementById('teamApplicationForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send the form data to your server here
            // For this demo, we'll just show a success message
            
            // Hide the form
            applicationForm.style.display = 'none';
            
            // Show success message
            formSuccess.style.display = 'block';
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Animation for page elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.position-card, .section-header, .application-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

if (applicationForm) {
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get the submit button and disable it
        const submitButton = applicationForm.querySelector("button[type='submit']");
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting..."; // Optional: change button text
        }

        // Collect form data
        const formData = new FormData(applicationForm);
        let formValues = {};
        formData.forEach((value, key) => {
            formValues[key] = value;
        });

        // Format message for Discord
        const payload = {
            content: "New Application Submission!\n" + 
                     Object.entries(formValues).map(([key, value]) => `**${key}:** ${value}`).join("\n")
        };

        // Send data to Discord webhook
        fetch("https://discord.com/api/webhooks/1418567487066214460/2uXKNNwgFEmoWI9iT9IKuNoa0vmJEMjJ4S4u-b9OLOAE49DM6VPAjA0ZsM92RXpcFGtf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);

            // Hide the form
            applicationForm.style.display = 'none';

            // Show success message
            const formSuccess = document.getElementById('formSuccess');
            if (formSuccess) {
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth' });
            }
        })
        .catch(error => {
            console.error("Error:", error);

            // Re-enable the button in case of an error
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit"; // Reset text
            }
        });
    });
}
