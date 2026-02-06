/*
 * script.js - Dipesh Kharel Portfolio Functionality
 * -----------------------------------
 * Includes Mobile Nav, Dark Mode Toggle, Scroll Animations, and ScrollSpy.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Common Elements ---
    const htmlElement = document.documentElement;
    const mainHeader = document.getElementById('mainHeader');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');

    // --- 1. Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    const toggleNav = () => {
        const isMenuOpen = navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');

        // A11y Improvement: Update aria-expanded state
        hamburger.setAttribute('aria-expanded', isMenuOpen);

        // Toggle icon between bars and close (X)
        if (isMenuOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleNav);

        // Close the menu when a link is clicked (only needed on mobile)
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                // Check if the menu is currently visible (assuming 'active' class means visible)
                if (navMenu.classList.contains('active')) {
                    toggleNav();
                }
            });
        });
    }


    // --- 2. Scroll Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll('.animate-in');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const animationObserver = new IntersectionObserver(observerCallback, observerOptions);

    animateElements.forEach(element => {
        animationObserver.observe(element);
    });


    // --- 3. Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    // Helper function to set the icon based on the current mode
    const updateDarkModeIcon = (isDark) => {
        if (darkModeIcon) {
            if (isDark) {
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    };

    // Initial icon state setup (using the class added in HTML <head>)
    const initialIsDark = htmlElement.classList.contains('dark-mode');
    updateDarkModeIcon(initialIsDark);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            // 1. Toggle the class on the <html> element
            htmlElement.classList.toggle('dark-mode');

            // 2. Determine the new state
            const isDark = htmlElement.classList.contains('dark-mode');

            // 3. Update localStorage and icon (simplified logic)
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            updateDarkModeIcon(isDark);
        });
    }


    // --- 4. ScrollSpy (Active Navigation Link) ---
    // Calculates the header height dynamically for accurate intersection observation
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;

    // Use a top margin equal to the negative header height + a small offset (e.g., 1px) 
    // This makes the intersection point right below the fixed header.
    const scrollSpyOptions = {
        rootMargin: `-${headerHeight + 1}px 0px 0px 0px`,
        threshold: 0.2 // Trigger when the top 20% of the section hits the margin line
    };

    const scrollSpyCallback = (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const currentLink = document.querySelector(`.nav-menu a[href="#${id}"]`);

            if (currentLink) {
                // If a section is intersecting, remove active from all and set it on the current one
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active-link'));
                    currentLink.classList.add('active-link');
                } else if (id === 'home' && !entry.isIntersecting) {
                    // This handles when the user scrolls past the 'home' section.
                    currentLink.classList.remove('active-link');
                }
            }
        });
    };

    const scrollSpyObserver = new IntersectionObserver(scrollSpyCallback, scrollSpyOptions);

    // Observe all sections that exist
    sections.forEach(section => {
        if (section) {
            scrollSpyObserver.observe(section);
        }
    });

    // Initial check to ensure 'home' is active on page load IF we are on home
    const initialHomeLink = document.querySelector('.nav-menu a[href="#home"]');
    // Only set home as active if we are actually on the homepage (url ends with index.html or /)
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

    if (initialHomeLink && isHomePage && !window.location.hash) {
        initialHomeLink.classList.add('active-link');
    }

    // Highlight active link for other pages
    const path = window.location.pathname;
    const pageLinks = {
        'projects.html': 'Projects',
        'research.html': 'Research',
        'learn.html': 'Learn'
    };

    for (const [page, linkText] of Object.entries(pageLinks)) {
        if (path.endsWith(page)) {
            const activeLink = Array.from(navLinks).find(link => link.textContent.trim() === linkText);
            if (activeLink) {
                navLinks.forEach(link => link.classList.remove('active-link'));
                activeLink.classList.add('active-link');
            }
        }
    }

    // --- 5. Paper Airplane Animation ---
    const techBtn = document.getElementById('tech-projects-btn');
    const paperAirplane = document.getElementById('paper-airplane');
    const projectsNavLink = document.getElementById('nav-projects-link');

    if (techBtn && paperAirplane && projectsNavLink) {
        // Register the plugin if available
        if (typeof gsap !== 'undefined' && typeof MotionPathPlugin !== 'undefined') {
            gsap.registerPlugin(MotionPathPlugin);

            techBtn.addEventListener('click', (e) => {
                e.preventDefault();

                // 2. Get Coordinates
                const btnRect = techBtn.getBoundingClientRect();
                const navRect = projectsNavLink.getBoundingClientRect();

                // Calculate start and end points relative to the viewport
                // We want to center the airplane on the button initially
                const startX = btnRect.left + btnRect.width / 2;
                const startY = btnRect.top + btnRect.height / 2;

                const endX = navRect.left + navRect.width / 2;
                const endY = navRect.top + navRect.height / 2;

                // 3. Prepare Airplane
                // Position it at the button center initially
                // Note: using fixed position in CSS, so x/y correspond to viewport coordinates
                gsap.set(paperAirplane, {
                    x: startX,
                    y: startY,
                    scale: 0.1, // Start small
                    opacity: 0,
                    display: 'block',
                    rotation: 0 // Reset rotation
                });

                // 4. Create Flight Path
                const tl = gsap.timeline({
                    onComplete: () => {
                        window.location.href = techBtn.getAttribute('href');
                    }
                });

                // Quadratic Bezier Control Point
                // Calculate a control point that creates a nice arc
                // Midpoint X, but significantly higher Y (or lower Y value for screen top)
                const controlX = (startX + endX) / 2;
                // Go higher than the highest point (min Y)
                const controlY = Math.min(startY, endY) - 150; 

                // --- Morph Effect Step ---
                const btnText = techBtn.querySelector('.btn-text');
                
                // Group the morphing animations for a tighter, snapier feel
                tl.to(btnText, { 
                    opacity: 0, 
                    duration: 0.1, // Faster fade
                    ease: "power1.out"
                }, "start")
                
                .to(techBtn, {
                    scale: 0, // Shrink to nothing
                    opacity: 0,
                    duration: 0.3, // Faster shrink
                    ease: "back.in(2)" // More anticipation
                }, "start") // Start immediately with text fade
                
                .to(paperAirplane, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.5)" // Snappy pop
                }, "start+=0.15") // Overlap slightly with button disappearance

                // --- Flight Step ---
                .to(paperAirplane, {
                    duration: 0.8, // Faster flight
                    motionPath: {
                        path: [
                            { x: startX, y: startY },
                            { x: controlX, y: controlY },
                            { x: endX, y: endY }
                        ],
                        curviness: 1.5,
                        autoRotate: true
                    },
                    scale: 1.2, 
                    ease: "power2.inOut",
                }, "-=0.2") 
                
                // 5. Shrink/Fade out at the end
                .to(paperAirplane, {
                    duration: 0.2,
                    scale: 0.1,
                    opacity: 0,
                    ease: "power1.out"
                }, "-=0.1")

                // 6. Target Pulse
                .add(() => {
                    projectsNavLink.classList.add('nav-target-pulse');
                }, "-=0.1"); 
            });
        } else {
             // Fallback if GSAP fails to load
            techBtn.addEventListener('click', () => {
                window.location.href = techBtn.getAttribute('href');
            });
        }
    }

});    // --- 6. Simple Contact Button ---
    const interactiveBtn = document.getElementById('interactiveSubmitBtn');
    const btnTextContent = interactiveBtn ? interactiveBtn.querySelector('.btn-text-content') : null;

    if (interactiveBtn) {
        interactiveBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Prevent multiple clicks
            if (interactiveBtn.classList.contains('sending') || interactiveBtn.classList.contains('sent')) return;

            // Start sending
            interactiveBtn.classList.add('sending');
            
            if (btnTextContent) {
                btnTextContent.textContent = "Sending...";
            }

            // Send Email via EmailJS
            const form = document.getElementById('emailForm');
            if (form && typeof emailjs !== 'undefined') {
                // Get form data
                const formData = new FormData(form);
                const templateParams = {
                    from_name: formData.get('Name'),
                    subject: formData.get('Subject'),
                    message: formData.get('Body'),
                    reply_to: 'mr.dipesh333@gmail.com'
                };

                // Send email using EmailJS
                emailjs.send(
                    'service_sivyejp',
                    'template_mey4gab',
                    templateParams,
                    'k3oWWZIRE4OopChrj'
                ).then(
                    function(response) {
                        console.log('Email sent successfully!', response.status, response.text);
                        
                        // Success State
                        interactiveBtn.classList.remove('sending');
                        interactiveBtn.classList.add('sent');
                        
                        if (btnTextContent) {
                            btnTextContent.textContent = "Message Sent! ✅";
                        }

                        // Reset after 4 seconds
                        setTimeout(() => {
                            if (btnTextContent) btnTextContent.textContent = "Send Message";
                            interactiveBtn.classList.remove('sent');
                            if (form) form.reset();
                        }, 4000);
                    },
                    function(error) {
                        console.error('Email sending failed:', error);
                        interactiveBtn.classList.remove('sending');
                        if (btnTextContent) {
                            btnTextContent.textContent = "Failed! Try again";
                        }
                        
                        // Reset after 4 seconds
                        setTimeout(() => {
                            if (btnTextContent) btnTextContent.textContent = "Send Message";
                        }, 4000);
                    }
                );
            }
        });
    }
