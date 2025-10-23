// ========== THEME TOGGLE FUNCTIONALITY ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('.theme-text');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
    
    function updateThemeButton(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        const themeText = document.querySelector('.theme-text');
        
        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark';
        }
    }
}

// ========== MOBILE NAVIGATION TOGGLE ==========
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Toggle mobile menu when hamburger is clicked
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========== CONTACT FORM HANDLING ==========
function initContactForm() {
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Form submission logic would go here
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
}

// ========== CERTIFICATE POPUP FUNCTIONALITY ==========
function initCertificatePopup() {
    const certificatePopup = document.getElementById('certificatePopup');
    const popupClose = document.getElementById('popupClose');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const certificateImg = document.getElementById('certificateImg');
    const certificatePlaceholder = document.getElementById('certificatePlaceholder');
    
    // Real certificate data mapping with actual certificate files
    const certificateData = {
        'fullstack': 'assets/certificates/certificate_1.jpg',
        'react': 'assets/certificates/certificate_2.jpg', 
        'javascript': 'assets/certificates/certificate_3.jpg',
        'uiux': 'assets/certificates/certificate_4.jpg'
    };
    
    // Certificate titles mapping for better display
    const certificateTitles = {
        'fullstack': 'Full Stack Web Development Certificate',
        'react': 'React Developer Certification',
        'javascript': 'JavaScript Algorithms Certificate', 
        'uiux': 'UI/UX Design Specialization Certificate'
    };
    
    // Add click event listeners to all certificate links
    const certificateLinks = document.querySelectorAll('.certificate-link');
    certificateLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const certificateType = this.getAttribute('data-certificate');
            const certificateUrl = certificateData[certificateType];
            const certificateTitle = certificateTitles[certificateType];
            
            // Show loading state
            certificatePlaceholder.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${certificateTitle}...</p>
            `;
            certificatePlaceholder.style.display = 'flex';
            certificateImg.style.display = 'none';
            
            // Load actual certificate image
            certificateImg.onload = function() {
                // Image loaded successfully
                certificateImg.style.display = 'block';
                certificatePlaceholder.style.display = 'none';
                certificateImg.alt = certificateTitle;
            };
            
            certificateImg.onerror = function() {
                // Image failed to load, show error state
                certificatePlaceholder.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Certificate not found</p>
                    <small>${certificateUrl}</small>
                `;
                certificatePlaceholder.style.display = 'flex';
                certificateImg.style.display = 'none';
            };
            
            // Set the image source to actual certificate
            certificateImg.src = certificateUrl;
            
            // Show the certificate popup
            certificatePopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Function to close the certificate popup
    function closePopup() {
        certificatePopup.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Reset image source to avoid caching issues
        certificateImg.src = '';
    }
    
    // Close popup when close buttons are clicked
    popupClose.addEventListener('click', closePopup);
    closePreviewBtn.addEventListener('click', closePopup);
    
    // Close popup when clicking on overlay background
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
    
    // Certificate verification button handler - Your original functionality
    verifyBtn.addEventListener('click', function() {
        alert('Certificate verification process would start here!');
        // In a real implementation, this would redirect to a verification page
        // or show verification details
    });
}

// ========== SCROLL-BASED SOCIAL ICONS VISIBILITY ==========
function initScrollEffects() {
    function handleScroll() {
        const homeSection = document.getElementById('home');
        const socialIcons = document.querySelector('.home-social-icons');
        const homeRect = homeSection.getBoundingClientRect();
        
        // Show social icons only when home section is visible in viewport
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
    
    // Initial check for social icons visibility
    handleScroll();
}

// ========== SKILL PROGRESS BAR ANIMATIONS ==========
function initSkillAnimations() {
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
        
        // Observe each skill card for animation triggers
        skillCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Initialize skill progress animations
    animateSkills();
}

// ========== INITIALIZE ALL FUNCTIONALITY ==========
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    initContactForm();
    initCertificatePopup();
    initScrollEffects();
    initSkillAnimations();
});