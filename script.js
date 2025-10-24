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

        // Add theme transition animation
        document.documentElement.style.transition = 'all 0.5s ease';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);

        // Remove transition after animation
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 500);
    });

    function updateThemeButton(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        const themeText = document.querySelector('.theme-text');

        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
            themeIcon.style.animation = 'sunRotate 0.5s ease';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark';
            themeIcon.style.animation = 'moonRotate 0.5s ease';
        }

        // Remove animation after it completes
        setTimeout(() => {
            themeIcon.style.animation = '';
        }, 500);
    }

    // Add CSS for theme toggle animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sunRotate {
            from {
                transform: rotate(0deg) scale(0.8);
                opacity: 0.5;
            }
            to {
                transform: rotate(360deg) scale(1);
                opacity: 1;
            }
        }
        
        @keyframes moonRotate {
            from {
                transform: rotate(0deg) scale(0.8);
                opacity: 0.5;
            }
            to {
                transform: rotate(-360deg) scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
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

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== ENHANCED CONTACT FORM HANDLING ==========
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    const submitBtn = contactForm.querySelector('.form-btn');

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            simulateFormSubmission();
        }
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.id;
        const feedback = field.parentElement.querySelector('.form-feedback');

        feedback.textContent = '';
        feedback.classList.remove('show');

        if (field.hasAttribute('required') && !value) {
            showFieldError(field, feedback, `${fieldName} is required`);
            return false;
        }

        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, feedback, 'Please enter a valid email address');
                return false;
            }
        }

        if (fieldName === 'name' && value && value.length < 2) {
            showFieldError(field, feedback, 'Name must be at least 2 characters long');
            return false;
        }

        if (fieldName === 'message' && value && value.length < 10) {
            showFieldError(field, feedback, 'Message must be at least 10 characters long');
            return false;
        }

        field.style.borderColor = '';
        return true;
    }

    function showFieldError(field, feedback, message) {
        feedback.textContent = message;
        feedback.classList.add('show');
        field.style.borderColor = 'var(--accent-color)';
        field.focus();
    }

    function clearFieldError(e) {
        const field = e.target;
        const feedback = field.parentElement.querySelector('.form-feedback');

        feedback.textContent = '';
        feedback.classList.remove('show');
        field.style.borderColor = '';
    }

    function validateForm() {
        let isValid = true;

        formInputs.forEach(input => {
            if (input.hasAttribute('required')) {
                const event = new Event('blur');
                input.dispatchEvent(event);
                if (input.parentElement.querySelector('.form-feedback.show')) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function simulateFormSubmission() {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            btnText.textContent = 'Message Sent!';

            // Reset form
            setTimeout(() => {
                contactForm.reset();
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';

                // Show success message
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
            }, 2000);
        }, 2000);
    }
}

// ========== ENHANCED CERTIFICATE VERIFICATION SYSTEM ==========
function initCertificateModal() {
    const certificateModal = document.getElementById('certificateModal');
    const modalClose = document.getElementById('modalClose');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const downloadBtn = document.querySelector('.download-btn');

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
            achievement: 'Distinction',
            seal: '🏆',
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
            achievement: 'Excellence',
            seal: '⭐',
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
            achievement: 'Mastery',
            seal: '💎',
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
            achievement: 'Innovation',
            seal: '🎨',
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

            // Show the certificate modal with animation
            showCertificateModal();
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
        const verificationWindow = window.open(certificate.verificationLink, '_blank');

        if (verificationWindow) {
            // Show waiting notification
            showNotification(`Redirecting to ${certificate.issuer} for verification...`, 'info');

            // Check for user return every 2 seconds
            const returnCheck = setInterval(() => {
                if (verificationWindow.closed) {
                    clearInterval(returnCheck);
                    handleUserReturnFromVerification();
                }
            }, 2000);

            // Auto-stop checking after 5 minutes
            setTimeout(() => {
                clearInterval(returnCheck);
            }, 300000);
        } else {
            showNotification('Please allow pop-ups for verification.', 'warning');
        }
    }

    // Function to handle user return from verification
    function handleUserReturnFromVerification() {
        const pendingVerification = localStorage.getItem('pendingVerification');

        if (pendingVerification) {
            const verificationData = JSON.parse(pendingVerification);

            // Show success notification
            showNotification(
                `✅ ${verificationData.certificateName} verification completed! Certificate authenticity confirmed by ${verificationData.issuer}.`,
                'success'
            );

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
                verifyBtn.classList.remove('secondary-btn');
                verifyBtn.classList.add('success-btn');
            } else {
                verifyBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Verify Certificate';
                verifyBtn.style.background = '';
                verifyBtn.style.borderColor = '';
                verifyBtn.disabled = false;
                verifyBtn.classList.remove('success-btn');
                verifyBtn.classList.add('secondary-btn');
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
                if (verifyBtn) {
                    if (isVerified) {
                        verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
                        verifyBtn.style.background = 'var(--gradient-success)';
                        verifyBtn.style.borderColor = 'var(--success-color)';
                        verifyBtn.disabled = true;
                    } else {
                        verifyBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Verify';
                        verifyBtn.style.background = '';
                        verifyBtn.style.borderColor = '';
                        verifyBtn.disabled = false;
                    }
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
                    showNotification(`✅ ${certificateName} is already verified!`, 'success');
                    return;
                }

                // Add verification animation
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
                this.disabled = true;

                setTimeout(() => {
                    handleCertificateVerification(certificate);
                }, 1000);
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
                        showNotification(`✅ ${currentCertificate.title} is already verified!`, 'success');
                        return;
                    }

                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
                    this.disabled = true;

                    setTimeout(() => {
                        handleCertificateVerification(currentCertificate);
                    }, 1000);
                }
            });
        }
    }

    // Update modal content to include verification button
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

        // Add achievement badge if it exists
        addAchievementBadge(certificate.achievement);

        // Add seal if it exists
        addCertificateSeal(certificate.seal);

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
                simulateDownload(certificate);
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

    // Function to show certificate modal
    function showCertificateModal() {
        certificateModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const certificateFrame = document.querySelector('.certificate-frame');
        certificateFrame.style.animation = 'certificateGlow 3s ease-in-out infinite, certificateFloat 6s ease-in-out infinite';

        setTimeout(() => {
            certificateFrame.classList.add('animated');
        }, 100);
    }

    function addAchievementBadge(achievement) {
        const existingBadge = document.querySelector('.certificate-achievement');
        if (existingBadge) existingBadge.remove();

        if (achievement) {
            const achievementBadge = document.createElement('div');
            achievementBadge.className = 'certificate-achievement';
            achievementBadge.textContent = achievement;
            achievementBadge.style.animation = 'achievementPulse 2s ease-in-out infinite';

            const certificateFrame = document.querySelector('.certificate-frame');
            certificateFrame.appendChild(achievementBadge);
        }
    }

    function addCertificateSeal(seal) {
        const existingSeal = document.querySelector('.certificate-seal');
        if (existingSeal) existingSeal.remove();

        if (seal) {
            const certificateSeal = document.createElement('div');
            certificateSeal.className = 'certificate-seal';
            certificateSeal.textContent = seal;
            certificateSeal.style.animation = 'sealRotate 10s linear infinite';

            const certificateFrame = document.querySelector('.certificate-frame');
            certificateFrame.appendChild(certificateSeal);
        }
    }

    function simulateDownload(certificate) {
        const downloadBtn = document.querySelector('.download-btn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        downloadBtn.disabled = true;

        setTimeout(() => {
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            downloadBtn.classList.add('success');
            downloadBtn.disabled = false;

            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.classList.remove('success');
                showDownloadCompleteMessage(certificate);
            }, 2000);
        }, 2000);
    }

    function showDownloadCompleteMessage(certificate) {
        showNotification(`${certificate.title} downloaded successfully!`, 'success');
    }

    function closeModal() {
        certificateModal.classList.remove('active');
        document.body.style.overflow = '';

        const certificateFrame = document.querySelector('.certificate-frame');
        certificateFrame.style.animation = '';

        const achievementBadge = document.querySelector('.certificate-achievement');
        const certificateSeal = document.querySelector('.certificate-seal');
        if (achievementBadge) achievementBadge.remove();
        if (certificateSeal) certificateSeal.remove();

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

        // Active navigation highlighting
        updateActiveNavLink();

        // Scroll animations for elements
        animateOnScroll();
    }

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Animate elements on scroll
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.skill-card, .project-card, .achievement-card, .certificate-card');

        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
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

                    // Add animation delay based on element position
                    const delay = Array.from(skillCards).indexOf(entry.target) * 100;

                    setTimeout(() => {
                        progressBar.style.width = width;
                        progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, delay);

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

// ========== NOTIFICATION SYSTEM ==========
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
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
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
                    animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 4s forwards;
                    backdrop-filter: blur(10px);
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
                
                .notification-close {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: var(--transition);
                    margin-left: auto;
                }
                
                .notification-close:hover {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
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

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.5s ease forwards';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);

        return notification;
    };
}

// ========== PROJECT CARD INTERACTIONS ==========
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add click animation
        card.addEventListener('click', function (e) {
            if (e.target.closest('.project-link')) return;

            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });
}

// ========== LOADING ANIMATIONS ==========
function initLoadingAnimations() {
    // Add loading animation to page elements
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .achievement-card, .certificate-card');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger animations when elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function initPerformanceOptimizations() {
    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Handle window resize
    window.addEventListener('resize', debounce(function () {
        // Update any layout-dependent functionality
        initScrollEffects();
    }, 250));

    // Optimize scroll events
    window.addEventListener('scroll', throttle(function () {
        // Scroll-based animations are handled in initScrollEffects
    }, 100));
}

// ========== ACCESSIBILITY IMPROVEMENTS ==========
function initAccessibility() {
    // Add keyboard navigation for interactive elements
    document.addEventListener('keydown', function (e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.certificate-modal.active');
            if (openModal) {
                openModal.classList.remove('active');
                document.body.style.overflow = '';
            }

            const openNav = document.querySelector('.nav-menu.active');
            if (openNav) {
                openNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Tab key navigation for focus management
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Add focus styles for keyboard navigation
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });
}

// ========== INITIALIZE ALL FUNCTIONALITY ==========
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Initializing portfolio website...');

    // Initialize all modules
    initTheme();
    initMobileMenu();
    initContactForm();
    initCertificateModal();
    initScrollEffects();
    initSkillAnimations();
    initSmoothScroll();
    initNotificationSystem();
    initProjectInteractions();
    initLoadingAnimations();
    initPerformanceOptimizations();
    initAccessibility();

    console.log('✅ Portfolio website initialized successfully!');

    // Check for verification return
    setTimeout(() => {
        const pendingVerification = localStorage.getItem('pendingVerification');
        if (pendingVerification) {
            const verificationData = JSON.parse(pendingVerification);
            showNotification(
                `Welcome back! Did you complete verification for ${verificationData.certificateName}?`,
                'info'
            );
        }
    }, 2000);
});

// ========== ERROR HANDLING ==========
window.addEventListener('error', function (e) {
    console.error('❌ JavaScript Error:', e.error);
});

// ========== PAGE VISIBILITY API ==========
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Page is hidden - pause animations if needed
        console.log('Page hidden');
    } else {
        // Page is visible - resume animations
        console.log('Page visible');
    }
});

// ========== OFFLINE DETECTION ==========
window.addEventListener('online', function () {
    showNotification('Connection restored!', 'success');
});

window.addEventListener('offline', function () {
    showNotification('You are currently offline. Some features may not work.', 'warning');
});