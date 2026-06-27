(function () {
  'use strict';

  /* ------------------------------------------------
     1. GLITCH EFFECT
  ------------------------------------------------ */
  function initGlitch() {
    var glitches = document.querySelectorAll('.glitch');
    if (!glitches.length) return;

    function triggerGlitch() {
      glitches.forEach(function (el) {
        el.classList.add('glitch--active');
        setTimeout(function () {
          el.classList.remove('glitch--active');
        }, 400);
      });
    }

    triggerGlitch();
    setInterval(triggerGlitch, 6000);
  }

  /* ------------------------------------------------
     2. ANIMATED COUNTERS
  ------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll('.titan-stat__num');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  function animateCounter(el, target) {
    var start = 0;
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (target > 0 && current === 0) el.textContent = '0';
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  /* ------------------------------------------------
     3. STICKY NAVBAR
  ------------------------------------------------ */
  function initStickyNav() {
    var navbar = document.querySelector('.titan-navbar');
    if (!navbar) return;

    function checkScroll() {
      if (window.scrollY > 80) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ------------------------------------------------
     4. BACK TO TOP
  ------------------------------------------------ */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'titan-back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);

    function checkScroll() {
      if (window.scrollY > 500) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------
     5. CTA MODAL
  ------------------------------------------------ */
  function initCTAModal() {
    var modalEl = document.getElementById('ctaModal');
    if (!modalEl) return;

    var closed = sessionStorage.getItem('ctaModalClosed');
    if (closed) return;

    setTimeout(function () {
      var modal = new bootstrap.Modal(modalEl, { backdrop: 'static' });
      modal.show();

      modalEl.addEventListener('hidden.bs.modal', function () {
        sessionStorage.setItem('ctaModalClosed', 'true');
      });
    }, 5000);
  }

  /* ------------------------------------------------
     6. FORM VALIDATION
  ------------------------------------------------ */
  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var successEl = document.getElementById('formSuccess');
    var submitBtn = form.querySelector('button[type="submit"]');
    var btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
    var originalText = btnSpan ? btnSpan.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      if (submitBtn && btnSpan) {
        btnSpan.textContent = 'Enviando...';
        submitBtn.disabled = true;
      }

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      fetch(form.action, {
        method: form.method,
        body: new URLSearchParams(data),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) return res.json();
          throw new Error('Network response was not ok');
        })
        .then(function () {
          if (successEl) successEl.classList.add('is-visible');
          form.reset();
          form.classList.remove('was-validated');
          if (submitBtn && btnSpan) {
            btnSpan.textContent = originalText;
            submitBtn.disabled = false;
          }
        })
        .catch(function () {
          if (successEl) {
            successEl.textContent = 'Ocurri\u00f3 un error. Intenta de nuevo.';
            successEl.style.color = 'var(--color-error)';
            successEl.classList.add('is-visible');
          }
          if (submitBtn && btnSpan) {
            btnSpan.textContent = originalText;
            submitBtn.disabled = false;
          }
        });
    });
  }

  /* ------------------------------------------------
     7. SMOOTH NAV (guard against href="#")
  ------------------------------------------------ */
  function initSmoothNav() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ------------------------------------------------
     8. SCROLL REVEAL
  ------------------------------------------------ */
  function initScrollReveal() {
    var els = document.querySelectorAll(
      '.titan-card, .titan-trainer, .titan-plan, .titan-stat, .titan-gallery__item, .titan-section__title'
    );
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* ------------------------------------------------
     9. IMAGE FALLBACK
  ------------------------------------------------ */
  function initImageFallback() {
    document.querySelectorAll('img[src*="unsplash"]').forEach(function (img) {
      img.addEventListener('error', function () {
        var w = img.getAttribute('width') || 600;
        var h = img.getAttribute('height') || 400;
        img.src = 'https://placehold.co/' + w + 'x' + h + '/1A1A1A/00FF41?text=TITAN';
        img.alt = img.alt || 'Imagen TITAN Fitness';
      });
    });
  }

  /* ------------------------------------------------
     10. COPYRIGHT YEAR
  ------------------------------------------------ */
  function initCopyrightYear() {
    var yearEls = document.querySelectorAll('.titan-footer__bottom p');
    yearEls.forEach(function (el) {
      el.textContent = el.textContent.replace(/\d{4}/, String(new Date().getFullYear()));
    });
  }

  /* ------------------------------------------------
     STORE — FILTERS
  ------------------------------------------------ */
  function initStoreFilters() {
    var filters = document.querySelectorAll('.titan-store__filter');
    var items = document.querySelectorAll('.titan-store__item');
    if (!filters.length || !items.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');

        filters.forEach(function (f) { f.classList.remove('is-active'); });
        btn.classList.add('is-active');

        items.forEach(function (item) {
          if (cat === 'all' || item.getAttribute('data-category') === cat) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* ------------------------------------------------
     STORE — CART
  ------------------------------------------------ */
  var STORAGE_KEY = 'titanCart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function updateCartUI() {
    var cart = getCart();
    var countEl = document.getElementById('cartCount');
    var itemsEl = document.getElementById('cartItems');
    var totalEl = document.getElementById('cartTotal');
    var checkoutBtn = document.getElementById('cartCheckout');

    var total = 0;
    var count = 0;

    if (countEl) countEl.textContent = cart.length;

    if (itemsEl) {
      if (!cart.length) {
        itemsEl.innerHTML = '<p class="titan-store__cart-empty">Tu carrito est\u00e1 vac\u00edo</p>';
      } else {
        var html = '';
        cart.forEach(function (item, idx) {
          total += item.price * item.qty;
          count += item.qty;
          html +=
            '<div class="titan-store__cart-item">' +
            '<span class="titan-store__cart-item-name">' + item.name + '</span>' +
            '<span class="titan-store__cart-item-price">$' + (item.price * item.qty).toLocaleString() + '</span>' +
            '<div class="titan-store__cart-item-qty">' +
            '<button data-idx="' + idx + '" data-action="dec" aria-label="Reducir cantidad">&minus;</button>' +
            '<span>' + item.qty + '</span>' +
            '<button data-idx="' + idx + '" data-action="inc" aria-label="Aumentar cantidad">+</button>' +
            '</div>' +
            '<button class="titan-store__cart-item-remove" data-idx="' + idx + '" aria-label="Eliminar del carrito"><i class="fa-solid fa-trash-can"></i></button>' +
            '</div>';
        });
        itemsEl.innerHTML = html;
        if (countEl) countEl.textContent = count;

        // Quantity controls
        itemsEl.querySelectorAll('[data-action]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            var action = btn.getAttribute('data-action');
            var cart = getCart();
            if (idx < 0 || idx >= cart.length) return;
            if (action === 'inc') {
              cart[idx].qty += 1;
            } else {
              cart[idx].qty -= 1;
              if (cart[idx].qty <= 0) cart.splice(idx, 1);
            }
            saveCart(cart);
            updateCartUI();
          });
        });

        // Remove buttons
        itemsEl.querySelectorAll('.titan-store__cart-item-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            var cart = getCart();
            if (idx >= 0 && idx < cart.length) cart.splice(idx, 1);
            saveCart(cart);
            updateCartUI();
          });
        });
      }
    }

    if (totalEl) totalEl.textContent = '$' + total.toLocaleString();
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  }

  function initStoreCart() {
    var addBtns = document.querySelectorAll('.titan-store__add');
    if (!addBtns.length) return;

    addBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-product');
        var price = parseInt(btn.getAttribute('data-price'), 10);
        if (!name || isNaN(price)) return;

        var cart = getCart();
        var existing = cart.find(function (item) { return item.name === name; });
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name: name, price: price, qty: 1 });
        }
        saveCart(cart);
        updateCartUI();
      });
    });

    updateCartUI();
  }

  /* ------------------------------------------------
     LIGHTBOX FOR GALLERY
  ------------------------------------------------ */
  function initGalleryLightbox() {
    var items = document.querySelectorAll('.titan-gallery__item');
    if (!items.length) return;

    var modalHtml =
      '<div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-lg modal-dialog-centered">' +
      '<div class="modal-content titan-modal">' +
      '<div class="modal-header border-0">' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>' +
      '</div>' +
      '<div class="modal-body text-center p-3">' +
      '<img class="gallery-modal-img" id="galleryModalImg" src="" alt="" />' +
      '<p class="gallery-modal-caption" id="galleryModalCaption"></p>' +
      '</div></div></div></div>';

    var modalContainer = document.getElementById('galleryModal');
    if (!modalContainer) {
      var div = document.createElement('div');
      div.innerHTML = modalHtml;
      document.body.appendChild(div.firstElementChild);
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        var caption = item.querySelector('.titan-gallery__overlay span');
        if (!img) return;

        var modalImg = document.getElementById('galleryModalImg');
        var modalCaption = document.getElementById('galleryModalCaption');
        if (modalImg) {
          modalImg.src = img.src.replace(/w=\d+/, 'w=800');
          modalImg.alt = img.alt;
        }
        if (modalCaption && caption) {
          modalCaption.textContent = caption.textContent.trim();
        }

        var modalEl = document.getElementById('galleryModal');
        if (modalEl) {
          var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.show();
        }
      });
    });
  }

  /* ------------------------------------------------
     INIT
  ------------------------------------------------ */
  function init() {
    initGlitch();
    initCounters();
    initStickyNav();
    initBackToTop();
    initCTAModal();
    initForm();
    initSmoothNav();
    initScrollReveal();
    initImageFallback();
    initCopyrightYear();
    initStoreFilters();
    initStoreCart();
    initGalleryLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
