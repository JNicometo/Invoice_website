/**
 * InvoicePro Landing Page JavaScript
 * Handles FAQ toggles and smooth scrolling
 */

// FAQ Toggle Functionality
function toggleFaq(index) {
    const faqItems = document.querySelectorAll('.faq-answer');
    const faqIcons = document.querySelectorAll('.faq-icon');

    // Get the clicked FAQ item
    const clickedItem = faqItems[index];
    const clickedIcon = faqIcons[index];

    // Toggle the clicked item
    clickedItem.classList.toggle('active');
    clickedIcon.classList.toggle('active');
}

// Smooth scroll to anchors (progressive enhancement)
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#" or "#buy" with no target
            if (href === '#' || href === '#buy') {
                // For #buy, we could scroll to the final CTA
                if (href === '#buy') {
                    e.preventDefault();
                    const buySection = document.querySelector('#buy');
                    if (buySection) {
                        buySection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                return;
            }

            // Check if target exists
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Optional: Add a "scroll to top" button (can be enabled later)
    // This is commented out for MVP, but can be easily activated
    /*
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition opacity-0 pointer-events-none';
    scrollToTopBtn.id = 'scrollToTop';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    */
});

// Analytics placeholder (can be added when ready)
// Example: Google Analytics, Plausible, or other analytics service
// This ensures the page works without JavaScript for core functionality
// while allowing progressive enhancement for tracking

/*
function trackEvent(category, action, label) {
    // Add your analytics tracking here
    // Example: gtag('event', action, { 'event_category': category, 'event_label': label });
    console.log('Event tracked:', category, action, label);
}

// Track CTA clicks
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('a[href="#pricing"], a[href="#buy"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('CTA', 'Click', this.innerText);
        });
    });
});
*/
