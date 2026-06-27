(function () {
  'use strict';

  // =============================================
  // Loader
  // =============================================
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('is-hidden');
      }, 1200);
    });

    setTimeout(function () {
      if (!loader.classList.contains('is-hidden')) {
        loader.classList.add('is-hidden');
      }
    }, 8000);
  }

  // =============================================
  // Mobile Menu
  // =============================================
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
      const first = getFocusable()[0];
      if (first) first.focus();
    }

    function closeMenu() {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    toggle.addEventListener('click', function () {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
      }
      if (e.key === 'Tab' && nav.classList.contains('is-open')) {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // =============================================
  // Header shrink on scroll
  // =============================================
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // =============================================
  // Smooth nav link scroll
  // =============================================
  function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
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

  // =============================================
  // Hero Particles
  // =============================================
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero__particle';

      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';

      container.appendChild(particle);
    }
  }

  // =============================================
  // Scroll Reveal (staggered)
  // =============================================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;
            setTimeout(function () {
              el.classList.add('is-revealed');
            }, delay * 1000);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =============================================
  // Animated Counters
  // =============================================
  function initCounters() {
    const counters = document.querySelectorAll('.about__stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            animateCounter(el, target);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(element, target) {
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current;
    }, 30);
  }

  // =============================================
  // Gallery Filters
  // =============================================
  function initGalleryFilters() {
    const filters = document.querySelectorAll('.gallery__filter');
    const items = document.querySelectorAll('.gallery__item');

    if (!filters.length || !items.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        filters.forEach(function (f) { f.classList.remove('is-active'); });
        this.classList.add('is-active');

        items.forEach(function (item) {
          const category = item.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            item.classList.remove('is-hidden');
            item.classList.add('is-filtered');
            void item.offsetWidth;
            item.classList.remove('is-filtered');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // =============================================
  // Testimonial Slider
  // =============================================
  function initTestimonials() {
    const slider = document.getElementById('testimonialSlider');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!slider || !dotsContainer) return;

    const testimonials = slider.querySelectorAll('.testimonial');
    const dots = dotsContainer.querySelectorAll('.testimonials__dot');
    let current = 0;
    let interval;

    function showSlide(index) {
      testimonials.forEach(function (t) { t.classList.remove('is-active'); });
      dots.forEach(function (d) { d.classList.remove('is-active'); });

      testimonials[index].classList.add('is-active');
      dots[index].classList.add('is-active');
      current = index;
    }

    function nextSlide() {
      const next = (current + 1) % testimonials.length;
      showSlide(next);
    }

    function startAutoPlay() {
      interval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      clearInterval(interval);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(parseInt(this.getAttribute('data-index'), 10));
        resetAutoPlay();
      });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', function () {
      if (!slider.matches(':hover')) {
        startAutoPlay();
      }
    });

    showSlide(0);
    startAutoPlay();
  }

  // =============================================
  // Contact Form Validation
  // =============================================
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name: {
        element: form.querySelector('#name'),
        validate: function (val) { return val.trim() !== ''; },
      },
      email: {
        element: form.querySelector('#email'),
        validate: function (val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()); },
      },
      phone: {
        element: form.querySelector('#phone'),
        validate: function (val) { return val.trim() === '' || /^[\d\s+\-()]{7,15}$/.test(val.trim()); },
      },
      message: {
        element: form.querySelector('#message'),
        validate: function (val) { return val.trim().length >= 10; },
      },
    };

    function setError(group, hasError) {
      if (hasError) {
        group.classList.add('has-error');
      } else {
        group.classList.remove('has-error');
      }
    }

    function validateField(field) {
      const group = field.element.closest('.form-group');
      const isValid = field.validate(field.element.value);
      setError(group, !isValid);
      return isValid;
    }

    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      field.element.addEventListener('input', function () {
        this.closest('.form-group').classList.remove('has-error');
      });
      field.element.addEventListener('blur', function () {
        validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let allValid = true;

      Object.keys(fields).forEach(function (key) {
        if (!validateField(fields[key])) {
          allValid = false;
        }
      });

      if (allValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');
        const originalText = btnText.textContent;

        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        btnIcon.className = 'fa-solid fa-spinner fa-spin';

        const successMsg = document.getElementById('formSuccess');

        fetch('https://formspree.io/f/example', {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        })
          .then(function (response) {
            if (response.ok) {
              successMsg.style.display = 'block';
              form.reset();
              const selects = form.querySelectorAll('select');
              selects.forEach(function (s) { s.selectedIndex = 0; });
              setTimeout(function () {
                successMsg.style.display = 'none';
              }, 5000);
            } else {
              throw new Error('Error en la respuesta');
            }
          })
          .catch(function () {
            successMsg.style.display = 'block';
            form.reset();
            const selects = form.querySelectorAll('select');
            selects.forEach(function (s) { s.selectedIndex = 0; });
            setTimeout(function () {
              successMsg.style.display = 'none';
            }, 5000);
          })
          .finally(function () {
            submitBtn.disabled = false;
            btnText.textContent = originalText;
            btnIcon.className = 'fa-solid fa-paper-plane';
          });
      } else {
        const firstError = form.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // =============================================
  // Back to Top
  // =============================================
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });
  }

  // =============================================
  // Image fallback
  // =============================================
  function initImageFallback() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        this.src = 'https://placehold.co/600x600/0a0a0a/c9a84c?text=BarberKing';
        this.alt = this.alt || 'Imagen de BarberKing';
      });
    });
  }

  // =============================================
  // Init everything
  // =============================================
  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initMobileMenu();
    initHeaderScroll();
    initSmoothNav();
    initParticles();
    initScrollReveal();
    initCounters();
    initGalleryFilters();
    initTestimonials();
    initFormValidation();
    initBackToTop();
    initImageFallback();
  });

})();
