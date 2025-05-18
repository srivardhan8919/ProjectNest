// Function to scroll to the specific section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
}

// ===== Scroll-Triggered Animations =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ===== Smooth Scroll Fallback =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

window.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM fully loaded');
  
    // Initialize EmailJS
    try {
      emailjs.init('DhTlNYYjlGGVlRhuZ');
      console.log('✅ EmailJS initialized successfully');
    } catch (err) {
      console.error('❌ EmailJS initialization failed:', err);
    }
  
    const form = document.getElementById('project-form');
    const status = document.getElementById('form-status');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('📨 Form submission triggered');
  
      status.textContent = '';
  
      // Basic form validation
      if (!form.checkValidity()) {
        console.warn('⚠️ Form validation failed');
        status.textContent = 'Please fill in all required fields.';
        return;
      }
  
      console.log('✅ Form is valid. Sending via EmailJS...');
      console.log('📦 Form data being sent using:', {
        serviceID: 'service_i75bswm',
        templateID: 'template_45s0vkq'
      });
  
      emailjs.sendForm('service_i75bswm', 'template_45s0vkq', form)
        .then(() => {
          console.log('✅ Email sent successfully');
          status.textContent = 'Thank you! We\'ll contact you soon.';
          form.reset();
        })
        .catch(error => {
          console.error('❌ EmailJS error:', error);
          status.textContent = 'Oops! Something went wrong—please try again.';
        });
    });
  });
  