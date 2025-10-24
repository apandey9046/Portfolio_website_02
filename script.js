// ========== THEME TOGGLE FUNCTIONALITY ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    // Theme toggle event listener
    themeToggle.addEventListener('click', function () {
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

    if (!hamburger || !navMenu) return;

    // Toggle mobile menu when hamburger is clicked
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== CONTACT FORM HANDLING ==========
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show success message
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
    });
}

// ========== SIMPLE CERTIFICATE VERIFICATION SYSTEM ==========
function initCertificateModal() {
    const certificateModal = document.getElementById('certificateModal');
    const modalClose = document.getElementById('modalClose');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Certificate data with verification links
    const certificateData = {
        'fullstack': {
            title: 'Full Stack Web Development Certificate',
            course: 'Full Stack Web Development',
            issuer: 'Udemy',
            date: 'June 15, 2023',
            duration: '120 Hours',
            description: 'Has successfully completed the Full Stack Web Development course, demonstrating proficiency in modern web technologies including HTML, CSS, JavaScript, Node.js, Express, and MongoDB.',
            skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
            certificateId: 'FSWD20230615',
            // TODO: ADD YOUR UDEMY CERTIFICATE VERIFICATION LINK HERE
            verificationLink: 'https://www.udemy.com/certificate/your-certificate-id-here/'
        },
        'react': {
            title: 'React Developer Certification',
            course: 'React Developer Professional Certificate',
            issuer: 'Meta',
            date: 'March 22, 2023',
            duration: '80 Hours',
            description: 'Has demonstrated advanced proficiency in React development, including hooks, state management, component architecture, and modern React patterns for building scalable applications.',
            skills: ['React', 'Redux', 'React Hooks', 'Context API', 'Component Testing', 'Performance Optimization'],
            certificateId: 'RCT20230322',
            // TODO: ADD YOUR META CERTIFICATE VERIFICATION LINK HERE
            verificationLink: 'https://coursera.org/verify/your-certificate-id-here'
        },
        'javascript': {
            title: 'JavaScript Algorithms Certificate',
            course: 'JavaScript Algorithms and Data Structures',
            issuer: 'freeCodeCamp',
            date: 'January 10, 2023',
            duration: '300 Hours',
            description: 'Has mastered JavaScript algorithms and data structures, demonstrating exceptional problem-solving skills and technical interview readiness through comprehensive coding challenges.',
            skills: ['Algorithms', 'Data Structures', 'ES6+', 'Problem Solving', 'Big O Notation', 'Recursion'],
            certificateId: 'JSALG20230110',
            // TODO: ADD YOUR FREECODECAMP CERTIFICATE VERIFICATION LINK HERE
            verificationLink: 'https://freecodecamp.org/certification/your-username/javascript-algorithms-and-data-structures'
        },
        'uiux': {
            title: 'UI/UX Design Specialization Certificate',
            course: 'UI/UX Design Professional Certificate',
            issuer: 'Google',
            date: 'November 30, 2022',
            duration: '150 Hours',
            description: 'Has completed the UI/UX Design Specialization, demonstrating expertise in user-centered design principles, wireframing, prototyping, and usability testing methodologies.',
            skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems'],
            certificateId: 'UIUX20221130',
            // TODO: ADD YOUR GOOGLE CERTIFICATE VERIFICATION LINK HERE
            verificationLink: 'https://coursera.org/verify/your-specialization-id-here'
        }
    };

    // Track current certificate for verification
    let currentCertificate = null;

    // Add click event listeners to all certificate view buttons
    const certificateButtons = document.querySelectorAll('.view-btn');
    certificateButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const certificateType = this.getAttribute('data-certificate');
            const certificate = certificateData[certificateType];

            if (!certificate) {
                showNotification('Certificate data not found!', 'error');
                return;
            }

            // Set current certificate
            currentCertificate = certificate;

            // Update modal content with certificate details
            updateModalContent(certificate);

            // Show the certificate modal
            certificateModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Function to handle certificate verification
    function handleCertificateVerification(certificate) {
        if (!certificate || !certificate.verificationLink) {
            showNotification('Verification link not available for this certificate.', 'error');
            return;
        }

        // Store certificate info for when user returns
        const verificationData = {
            certificateName: certificate.title,
            issuer: certificate.issuer,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('pendingVerification', JSON.stringify(verificationData));

        // Open verification link in new tab
        window.open(certificate.verificationLink, '_blank');
    }

    // Function to handle user return from verification
    function handleUserReturnFromVerification() {
        const pendingVerification = localStorage.getItem('pendingVerification');

        if (pendingVerification) {
            const verificationData = JSON.parse(pendingVerification);

            // Update verify button in modal if it's the same certificate
            if (currentCertificate && currentCertificate.title === verificationData.certificateName) {
                updateVerifyButtonInModal(true);
            }

            // Update all verify buttons for this certificate
            updateAllVerifyButtons(verificationData.certificateName, true);

            // Clear stored verification data
            localStorage.removeItem('pendingVerification');

            // Store permanent verification status
            const verifiedCertificates = JSON.parse(localStorage.getItem('verifiedCertificates') || '{}');
            verifiedCertificates[verificationData.certificateName] = {
                verified: true,
                verifiedAt: new Date().toISOString(),
                issuer: verificationData.issuer
            };
            localStorage.setItem('verifiedCertificates', JSON.stringify(verifiedCertificates));
        }
    }

    // Function to update verify button in modal
    function updateVerifyButtonInModal(isVerified) {
        const verifyBtn = document.querySelector('.modal-verify-btn');
        if (verifyBtn) {
            if (isVerified) {
                verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
                verifyBtn.style.background = 'var(--gradient-success)';
                verifyBtn.style.borderColor = 'var(--success-color)';
                verifyBtn.disabled = true;
            }
        }
    }

    // Function to update all verify buttons for a certificate
    function updateAllVerifyButtons(certificateName, isVerified) {
        const certificateCards = document.querySelectorAll('.certificate-card');
        certificateCards.forEach(card => {
            const cardTitle = card.querySelector('.certificate-name').textContent;
            if (cardTitle === certificateName) {
                const verifyBtn = card.querySelector('.verify-btn');
                if (verifyBtn && isVerified) {
                    verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
                    verifyBtn.style.background = 'var(--gradient-success)';
                    verifyBtn.style.borderColor = 'var(--success-color)';
                    verifyBtn.disabled = true;
                }
            }
        });
    }

    // Check for verified certificates on page load
    function loadVerifiedCertificates() {
        const verifiedCertificates = JSON.parse(localStorage.getItem('verifiedCertificates') || '{}');

        Object.keys(verifiedCertificates).forEach(certificateName => {
            if (verifiedCertificates[certificateName].verified) {
                updateAllVerifyButtons(certificateName, true);
            }
        });
    }

    // Verify button functionality in certificate cards
    const verifyButtons = document.querySelectorAll('.verify-btn');
    verifyButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const certificateCard = this.closest('.certificate-card');
            const certificateName = certificateCard.querySelector('.certificate-name').textContent;

            // Find certificate data
            const certificateType = Object.keys(certificateData).find(key =>
                certificateData[key].title === certificateName
            );

            if (certificateType) {
                const certificate = certificateData[certificateType];

                // Check if already verified
                const verifiedCertificates = JSON.parse(localStorage.getItem('verifiedCertificates') || '{}');
                if (verifiedCertificates[certificateName]?.verified) {
                    return;
                }

                handleCertificateVerification(certificate);
            }
        });
    });

    // Modal verify button functionality
    function initModalVerifyButton() {
        const modalVerifyBtn = document.querySelector('.modal-verify-btn');
        if (modalVerifyBtn) {
            modalVerifyBtn.addEventListener('click', function () {
                if (currentCertificate) {
                    // Check if already verified
                    const verifiedCertificates = JSON.parse(localStorage.getItem('verifiedCertificates') || '{}');
                    if (verifiedCertificates[currentCertificate.title]?.verified) {
                        return;
                    }

                    handleCertificateVerification(currentCertificate);
                }
            });
        }
    }

    // Update modal content
    function updateModalContent(certificate) {
        document.getElementById('modalCertificateTitle').textContent = certificate.title;
        document.getElementById('certificateTitle').textContent = certificate.title;
        document.getElementById('certificateSubtitle').textContent = 'This certificate is proudly presented to';
        document.getElementById('certificateText').textContent = certificate.description;
        document.getElementById('detailCourse').textContent = certificate.course;
        document.getElementById('detailIssuer').textContent = certificate.issuer;
        document.getElementById('detailDate').textContent = certificate.date;
        document.getElementById('detailDuration').textContent = certificate.duration;
        document.getElementById('certificateId').textContent = certificate.certificateId;

        // Update modal actions to include verify button
        updateModalActions(certificate);
    }

    // Update modal actions to include verify button
    function updateModalActions(certificate) {
        const modalActions = document.querySelector('.modal-actions');

        // Check if already verified
        const verifiedCertificates = JSON.parse(localStorage.getItem('verifiedCertificates') || '{}');
        const isVerified = verifiedCertificates[certificate.title]?.verified;

        const verifyButtonHTML = isVerified ?
            `<button class="btn success-btn modal-verify-btn" disabled>
                <i class="fas fa-check-circle"></i>
                Verified
            </button>` :
            `<button class="btn secondary-btn modal-verify-btn">
                <i class="fas fa-shield-alt"></i>
                Verify Certificate
            </button>`;

        modalActions.innerHTML = `
            <button class="btn primary-btn download-btn">
                <i class="fas fa-download"></i>
                Download PDF
            </button>
            ${verifyButtonHTML}
            <button class="btn secondary-btn close-modal-btn" id="closeModalBtn">
                <i class="fas fa-times"></i>
                Close
            </button>
        `;

        // Re-initialize event listeners
        initModalVerifyButton();
        initDownloadButton(certificate);
        initCloseModalButton();
    }

    // Initialize download button in modal
    function initDownloadButton(certificate) {
        const downloadBtn = document.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.onclick = function () {
                // Simple download simulation
                showNotification(`${certificate.title} download started!`, 'info');
            };
        }
    }

    // Initialize close modal button
    function initCloseModalButton() {
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.onclick = closeModal;
        }
    }

    function closeModal() {
        certificateModal.classList.remove('active');
        document.body.style.overflow = '';
        currentCertificate = null;
    }

    // Close modal when close buttons are clicked
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking on overlay background
    certificateModal.addEventListener('click', function (e) {
        if (e.target === this || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Load verified certificates on initialization
    loadVerifiedCertificates();

    // Check for pending verification on page load
    window.addEventListener('load', function () {
        const pendingVerification = localStorage.getItem('pendingVerification');
        if (pendingVerification) {
            // If there's pending verification, assume user just returned
            setTimeout(() => {
                handleUserReturnFromVerification();
            }, 1000);
        }
    });
}

// ========== SCROLL-BASED EFFECTS ==========
function initScrollEffects() {
    // Social icons visibility
    function handleScroll() {
        const homeSection = document.getElementById('home');
        const socialIcons = document.querySelector('.home-social-icons');

        if (!homeSection || !socialIcons) return;

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
    window.addEventListener('scroll', function () {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function () {
                scrollTimeout = null;
                handleScroll();
            }, 100);
        }
    });

    // Initial check
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

// ========== SMOOTH SCROLLING ==========
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== SIMPLE NOTIFICATION SYSTEM ==========
function initNotificationSystem() {
    window.showNotification = function (message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-card);
                    color: var(--text-primary);
                    padding: 1rem 1.5rem;
                    border-radius: var(--border-radius);
                    box-shadow: var(--box-shadow);
                    border: 1px solid var(--border-color);
                    z-index: 3000;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    max-width: 400px;
                    animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 3s forwards;
                }
                
                .notification-success {
                    border-left: 4px solid var(--success-color);
                }
                
                .notification-error {
                    border-left: 4px solid var(--accent-color);
                }
                
                .notification-warning {
                    border-left: 4px solid var(--warning-color);
                }
                
                .notification-info {
                    border-left: 4px solid var(--info-color);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    };
}

// ========== INITIALIZE ALL FUNCTIONALITY ==========
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initTheme();
    initMobileMenu();
    initContactForm();
    initCertificateModal();
    initScrollEffects();
    initSkillAnimations();
    initSmoothScroll();
    initNotificationSystem();
});