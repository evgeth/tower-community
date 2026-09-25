const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = !open;
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}));

// Keep mobile navigation predictable for keyboard and touch users.
const closeMenu = (restoreFocus = false) => {
  if (!menu || !toggle) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  if (restoreFocus) toggle.focus();
};
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu && !menu.hidden) closeMenu(true);
});
document.addEventListener('click', event => {
  if (menu && !menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const track = document.querySelector('#resident-track');
const previous = document.querySelector('.carousel-prev');
const next = document.querySelector('.carousel-next');
if (track && previous && next) {
  const updateControls = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const move = direction => {
    const card = track.querySelector('.member-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateControls, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.target === track && ['ArrowLeft','ArrowRight'].includes(event.key)) {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  window.addEventListener('resize', updateControls);
  if ('ResizeObserver' in window) new ResizeObserver(updateControls).observe(track);
  document.fonts?.ready.then(updateControls);
  updateControls();
}

// Page choreography: one-time entrances with a short stagger within each group.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const running = new Set();
  const play = (element, frames, options) => {
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (preference.matches) return;
      play(target, [
        {opacity:0, transform:'translateY(24px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:760, delay:Number(target.dataset.motionDelay || 0), easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards'});
    });
  }, {threshold:0.08});
  const groups = ['.stats > div','.founder-grid > article','.audience-grid > article','.logo-groups > div','.speaker-brands > div','.event-gallery > *','.faq-list > details'];
  groups.forEach(selector => document.querySelectorAll(selector).forEach((element,index) => {
    element.dataset.motionDelay = String((index % 4) * 85);
  }));
  const selectors = [...groups,'.hero-copy','.section-heading','.telegram-feature','.benefits > article:not(.telegram-feature)','.join-panel','.contact-panel'];
  if (!preference.matches) document.querySelectorAll(selectors.join(',')).forEach(element => observer.observe(element));
  // Keyboard focus always reveals its destination immediately.
  document.addEventListener('focusin', event => running.forEach(animation => {
    if (animation.effect.target.contains(event.target)) animation.finish();
  }));
  document.querySelectorAll('.faq-list details').forEach(details => {
    const summary = details.querySelector('summary');
    let animation = null;
    let desiredOpen = details.open;
    summary.addEventListener('click', event => {
      if (preference.matches) return;
      event.preventDefault();
      const start = details.getBoundingClientRect().height;
      desiredOpen = animation ? !desiredOpen : !details.open;
      if (animation) animation.cancel();
      details.open = true;
      const end = desiredOpen ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
      details.style.overflow = 'hidden';
      animation = play(details,[{height:start+'px'},{height:end+'px'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
      animation.onfinish = () => {
        details.open = desiredOpen;
        details.style.overflow = '';
        animation = null;
      };
      animation.oncancel = () => { details.style.overflow = ''; };
    });
    preference.addEventListener('change', () => {
      if (preference.matches && animation) {
        animation.cancel(); animation = null;
        details.open = desiredOpen;
      }
    });
  });
  preference.addEventListener('change', () => {
    if (preference.matches) {
      observer.disconnect();
      running.forEach(animation => animation.cancel());
      running.clear();
    }
  });
})();
