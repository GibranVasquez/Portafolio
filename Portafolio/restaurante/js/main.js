(function () {
  'use strict';

  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    setTimeout(() => {
      loader.classList.add('is-hidden');
    }, 8000);

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('is-hidden');
      }, 1000);
    });
  }

  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const links = document.querySelectorAll('.header__link');
    if (!toggle || !nav) return;

    let lastFocused = null;

    function getFocusable() {
      return nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    }

    function openMenu() {
      lastFocused = document.activeElement;
      toggle.classList.add('is-active');
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    }

    function closeMenu() {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    toggle.addEventListener('click', () => {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    links.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        return;
      }
      if (e.key === 'Tab' && nav.classList.contains('is-open')) {
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 80);
    });
  }

  function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initScrollReveal() {
    const selectors = ['.reveal-left', '.reveal-right', '.reveal-up', '.reveal-scale', '.reveal-fade'];
    const elements = document.querySelectorAll(selectors.join(','));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;

            if (el.classList.contains('reveal-left') || el.classList.contains('reveal-right')) {
              const rect = el.getBoundingClientRect();
              const center = window.innerWidth / 2;
              const elMid = rect.left + rect.width / 2;
              if (elMid < center) {
                el.classList.remove('reveal-right');
                el.classList.add('reveal-left');
              } else {
                el.classList.remove('reveal-left');
                el.classList.add('reveal-right');
              }
            }

            setTimeout(() => { el.classList.add('is-revealed'); }, delay * 1000);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }

  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu__tab');
    const panels = {
      starters: document.getElementById('tab-starters'),
      mains: document.getElementById('tab-mains'),
      desserts: document.getElementById('tab-desserts'),
    };
    if (!tabs.length || !panels.starters) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const target = this.getAttribute('data-tab');
        tabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
        Object.keys(panels).forEach(key => { panels[key].classList.remove('is-active'); });
        if (panels[target]) panels[target].classList.add('is-active');
      });
    });
  }

  function initFormValidation() {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    const fields = {
      name: { element: form.querySelector('#resName'), validate: v => v.trim() !== '' },
      email: { element: form.querySelector('#resEmail'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      phone: { element: form.querySelector('#resPhone'), validate: v => v.trim().length >= 7 },
      date: { element: form.querySelector('#resDate'), validate: v => v !== '' },
      time: { element: form.querySelector('#resTime'), validate: v => v !== '' },
      guests: { element: form.querySelector('#resGuests'), validate: v => v !== '' },
    };

    function validateField(field) {
      const group = field.element.closest('.form-group');
      const ok = field.validate(field.element.value);
      group.classList.toggle('has-error', !ok);
      return ok;
    }

    Object.keys(fields).forEach(key => {
      const f = fields[key];
      f.element.addEventListener('input', function () { this.closest('.form-group').classList.remove('has-error'); });
      f.element.addEventListener('blur', () => validateField(f));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const msg = document.getElementById('formSuccess');
      const originalMsgHTML = msg.innerHTML;

      let allOk = true;
      Object.keys(fields).forEach(key => { if (!validateField(fields[key])) allOk = false; });

      if (!allOk) {
        const first = form.querySelector('.has-error');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const data = {};
      Object.keys(fields).forEach(key => { data[key] = fields[key].element.value; });

      btn.disabled = true;
      btn.classList.add('is-loading');
      const btnSpan = btn.querySelector('span');
      const origBtnText = btnSpan.textContent;
      btnSpan.textContent = 'Enviando...';

      fetch('https://formspree.io/f/example', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        msg.innerHTML = originalMsgHTML;
        msg.style.display = 'block';
        form.reset();
        form.querySelectorAll('select').forEach(s => { s.selectedIndex = 0; });
      })
      .catch(() => {
        msg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error al enviar. Intenta de nuevo.';
        msg.style.display = 'block';
      })
      .finally(() => {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        btnSpan.textContent = origBtnText;
      });
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      const visible = window.scrollY > 500;
      btn.classList.toggle('is-visible', visible);
      btn.setAttribute('aria-hidden', !visible);
    });
  }

  function initImageFallback() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        this.src = 'https://placehold.co/600x600/0D3B43/E9C46A?text=La+Brasa';
        this.alt = this.alt || 'Imagen de La Brasa Tulum';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initMobileMenu();
    initHeaderScroll();
    initSmoothNav();
    initScrollReveal();
    initMenuTabs();
    initFormValidation();
    initBackToTop();
    initImageFallback();
  });

})();
