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

// main.js

window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded');

  // — Initialize EmailJS right away (SDK has already loaded via defer) —
  try {
    emailjs.init('DySOBcBNihEvHSwPH');
    console.log('✅ EmailJS initialized');
  } catch (err) {
    console.error('❌ EmailJS init error:', err);
  }

  // — Attach form handlers immediately so they preventDefault() —
  initProjectForm();
  initCourseForm();

  // — Global UI behaviors (nav toggle, smooth scroll, animations) —
  initGlobalUI();

  // — Course-page behaviors (filter, modal) —
  initCoursePageUI();
});

// —————— FORM HANDLERS ——————

function initProjectForm() {
  const form = document.getElementById('project-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();   // ← stops normal GET+reload
    status.textContent = '';

    if (!form.checkValidity()) {
      return void (status.textContent = '⚠️ Please fill in all required fields.');
    }

    emailjs.sendForm('service_i75bswm','template_45s0vkq', form)
      .then(() => {
        status.textContent = '✅ Project submitted successfully!';
        form.reset();
      })
      .catch(err => {
        console.error('❌ Email send failed:', err);
        status.textContent = '❌ Something went wrong. Try again.';
      });
  });
}

function initCourseForm() {
  const form = document.getElementById('course-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();   // ← stops normal GET+reload
    status.textContent = '';

    if (!form.checkValidity()) {
      return void (status.textContent = '⚠️ Please fill in all required fields.');
    }

    emailjs.sendForm('service_i75bswm','template_q7hx1dp', form)
      .then(() => {
        status.textContent = '✅ Course submitted successfully!';
        form.reset();
      })
      .catch(err => {
        console.error('❌ Email send failed:', err);
        status.textContent = '❌ Something went wrong. Try again.';
      });
  });
}

// —————— UI BEHAVIORS ——————

function initGlobalUI() {
  // Nav toggle
  const btn = document.getElementById('nav-toggle'),
        menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const exp = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!exp));
      menu.classList.toggle('hidden');
    });
  }

  // Smooth-scroll links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const tgt = document.querySelector(a.getAttribute('href'));
      if (tgt) {
        e.preventDefault();
        tgt.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scroll animations
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.animate-on-scroll')
          .forEach(el => obs.observe(el));
}

function initCoursePageUI() {
  // Only run if level-filter exists
  if (!document.getElementById('level-filter')) return;

  // Filtering
  const lvl = document.getElementById('level-filter'),
        cat = document.getElementById('category-filter'),
        dur = document.getElementById('duration-filter'),
        cards = document.querySelectorAll('.course-card');

  function apply() {
    const lv = lvl.value, ct = cat.value, dr = dur.value;
    cards.forEach(card => {
      const ok = (lv==='all'||card.dataset.level===lv)
              && (ct==='all'||card.dataset.category===ct)
              && (dr==='all'||card.dataset.duration===dr);
      card.style.display = ok ? '' : 'none';
      if (ok) card.style.animation = 'fadeIn 0.5s ease forwards';
    });
  }
  [lvl, cat, dur].forEach(el => el.addEventListener('change', apply));

  // Modal
  const modal = document.getElementById('course-modal');
  const close = modal?.querySelector('.modal-close');

  document.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.course-card');
      if (!card) return;
      document.getElementById('modal-title')      .textContent = card.dataset.title;
      document.getElementById('modal-description').textContent = card.dataset.description;
      document.getElementById('modal-meta')       .textContent = `${card.dataset.level} • ${card.dataset.category}`;
      document.getElementById('modal-duration')   .textContent = `${card.dataset.duration} Weeks`;
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.add('active'), 10);
      document.body.style.overflow = 'hidden';
    });
  });

  if (close && modal) {
    function hide() {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
    close.addEventListener('click', hide);
    modal.addEventListener('click', e => e.target===modal && hide());
    document.addEventListener('keydown', e => e.key==='Escape' && !modal.classList.contains('hidden') && hide());

    const enroll = document.querySelector('.enroll-btn');
    if (enroll) {
      enroll.addEventListener('click', e => {
        e.preventDefault();
        hide();
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
}
