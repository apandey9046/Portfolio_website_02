// Simple JavaScript for mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Certificate Popup functionality
    const certificatePopup = document.getElementById('certificatePopup');
    const popupClose = document.getElementById('popupClose');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const certificateImg = document.getElementById('certificateImg');
    const certificatePlaceholder = document.getElementById('certificatePlaceholder');
    
    // Certificate data (you can replace these with actual certificate image URLs)
    const certificateData = {
        'fullstack': 'assets/certificates/fullstack-certificate.jpg',
        'react': 'assets/certificates/react-certificate.jpg',
        'javascript': 'assets/certificates/javascript-certificate.jpg',
        'uiux': 'assets/certificates/uiux-certificate.jpg'
    };
    
    // Open certificate popup when clicking on "View Certificate"
    const certificateLinks = document.querySelectorAll('.certificate-link');
    certificateLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const certificateType = this.getAttribute('data-certificate');
            const certificateUrl = certificateData[certificateType];
            
            // Show placeholder (you can replace this with actual certificate image)
            certificateImg.style.display = 'none';
            certificatePlaceholder.style.display = 'block';
            
            // If you have actual certificate images, you can use this:
            // certificateImg.src = certificateUrl;
            // certificateImg.style.display = 'block';
            // certificatePlaceholder.style.display = 'none';
            
            certificatePopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close popup functions
    function closePopup() {
        certificatePopup.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    popupClose.addEventListener('click', closePopup);
    closePreviewBtn.addEventListener('click', closePopup);
    
    // Close popup when clicking on overlay
    certificatePopup.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('popup-overlay')) {
            closePopup();
        }
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certificatePopup.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Verify certificate button
    verifyBtn.addEventListener('click', function() {
        alert('Certificate verification process would start here!');
        // In a real implementation, this would redirect to a verification page
        // or show verification details
    });
    
    // Hide social icons when not on home section
    function handleScroll() {
        const homeSection = document.getElementById('home');
        const socialIcons = document.querySelector('.home-social-icons');
        const homeRect = homeSection.getBoundingClientRect();
        
        // Show social icons only when home section is in view
        if (homeRect.top <= 100 && homeRect.bottom >= 100) {
            socialIcons.style.display = 'flex';
        } else {
            socialIcons.style.display = 'none';
        }
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                handleScroll();
            }, 100);
        }
    });
    
    // Initial check
    handleScroll();
    
    // Animate skill progress bars when they come into view
    function animateSkills() {
        const skillCards = document.querySelectorAll('.skill-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Initialize skill animations
    animateSkills();
});