const PASSWORD = 'JoinThePower<3';

// Password gate
const gate = document.getElementById('gate');
const form = document.getElementById('gate-form');
const input = document.getElementById('gate-password');
const error = document.getElementById('gate-error');
const content = document.getElementById('content');

// Check if already authenticated
if (sessionStorage.getItem('tower-auth') === '1') {
  gate.style.display = 'none';
  content.classList.remove('hidden');
  initPage();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value === PASSWORD) {
    sessionStorage.setItem('tower-auth', '1');
    gate.classList.add('leaving');
    setTimeout(() => {
      gate.style.display = 'none';
      content.classList.remove('hidden');
      initPage();
    }, 600);
  } else {
    error.textContent = 'Wrong password';
    input.value = '';
    input.focus();
    error.style.animation = 'none';
    error.offsetHeight; // reflow
    error.style.animation = 'shake 0.4s ease';
  }
});

function initPage() {
  initReveal();
  initNav();
  initMobileNav();
  initCountUp();
  initCarousel();
}

function initCarousel() {
  const carousel = document.getElementById('life-carousel');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!carousel || !dotsContainer) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(slides).indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { root: carousel, threshold: 0.6 });

  slides.forEach(s => observer.observe(s));
}

function initCountUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/^([^0-9]*)([\d,]+)(.*)$/);
        if (!match) return;
        const prefix = match[1];
        const target = parseInt(match[2].replace(/,/g, ''), 10);
        const suffix = match[3];
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// Scroll reveal
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // No stagger for reveal-left (section titles)
        if (entry.target.classList.contains('reveal-left')) {
          entry.target.classList.add('visible');
        } else {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-scale');
          const index = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 120);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => observer.observe(el));
}

// Sticky nav on scroll past hero
function initNav() {
  const nav = document.querySelector('.nav');
  const hero = document.getElementById('hero');

  const navObserver = new IntersectionObserver(([entry]) => {
    nav.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.1 });

  navObserver.observe(hero);
}

// Mobile nav toggle
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const setOpen = (isOpen) => {
    toggle.classList.toggle('open', isOpen);
    links.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(!toggle.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      setOpen(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!toggle.classList.contains('open')) return;
    if (toggle.contains(event.target) || links.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      setOpen(false);
    }
  });
}


// Shake animation (injected as CSS)
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
`;
document.head.appendChild(style);
