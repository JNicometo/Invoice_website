// ========================================
// OwnInvoice by Grit Software - Marketing Website
// ========================================

// Stripe Checkout
function checkout() {
  window.location.href = 'https://buy.stripe.com/aFacN54wo5De3DU9PW53O0a';
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      navToggle.classList.toggle('active');

      if (navToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // --- Navbar Scroll ---
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open');
      question.setAttribute('aria-expanded', !isOpen);
    });
  });

  // --- Screenshot Tabs ---
  const screenshotTabs = document.querySelectorAll('.screenshot-tab');
  const screenshotImg = document.getElementById('screenshotImg');
  const screenshotMap = {
    dashboard: 'dash.png',
    reports: 'sales.png',
    clients: 'clients.png',
    items: 'items.png'
  };

  screenshotTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      screenshotTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.getAttribute('data-tab');
      if (screenshotImg && screenshotMap[tabName]) {
        screenshotImg.src = screenshotMap[tabName];
        screenshotImg.alt = 'OwnInvoice ' + tab.textContent;
      }
    });
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Contact Form (Web3Forms) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value.trim();
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '3e86fe22-265a-48e3-a916-e190b33e4c28',
            subject: '[' + subject + '] from ' + name,
            from_name: 'OwnInvoice Contact Form',
            name: name,
            email: email,
            message: message
          })
        });
        if (res.ok) {
          btn.textContent = 'Sent!';
          btn.style.background = '#10B981';
          contactForm.reset();
          setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; }, 3000);
        } else { throw new Error('Failed'); }
      } catch (err) {
        btn.textContent = 'Error - try again';
        btn.style.background = '#EF4444';
        setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; }, 3000);
      }
    });
  }

  // --- Trial Download Gates ---
  function setupTrialGate(formId, linksId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '3e86fe22-265a-48e3-a916-e190b33e4c28',
            subject: 'OwnInvoice Trial Download',
            from_name: 'Trial Download Gate',
            name: name,
            email: email,
            message: name + ' (' + email + ') requested the OwnInvoice trial.'
          })
        });
      } catch (err) {}
      form.style.display = 'none';
      var links = document.getElementById(linksId);
      if (links) links.style.display = 'flex';
    });
  }
  setupTrialGate('heroTrialGate', 'heroTrialLinks');
  setupTrialGate('ctaTrialGate', 'ctaTrialLinks');

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
