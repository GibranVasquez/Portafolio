(function () {
  'use strict';

  function initLoader() {
    var loader = document.getElementById('astraloader');
    var bar = document.getElementById('loaderBar');
    if (!loader || !bar) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        bar.style.width = '100%';
        setTimeout(function () {
          loader.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 500);
      }
      bar.style.width = progress + '%';
    }, 150);

    document.body.style.overflow = 'hidden';
  }

  function initCursor() {
    var ring = document.getElementById('cursorRing');
    var dot = document.getElementById('cursorDot');
    if (!ring || !dot) return;

    var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    var ringX = 0, ringY = 0;
    var dotX = 0, dotY = 0;
    var mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotX = mouseX;
      dotY = mouseY;
      dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    var interactives = document.querySelectorAll(
      'a, button, .astrabtn, .astranav__link, .astraskills__item, .astraprojects__card, .astraservices__card, .astraservices-plan, .astraprocess__step, .astrapropuesta__card'
    );
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-expanded'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-expanded'); });
    });
  }

  function initParticles() {
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var PARTICLE_COUNT = 80;
    var CONNECT_DIST = 140;
    var MOUSE_RADIUS = 120;

    function createParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '16, 140, 253' : '19, 90, 209'
        });
      }
    }
    createParticles();

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', 0.8)';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx2 = p.x - p2.x;
          var dy2 = p.y - p2.y;
          var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < CONNECT_DIST) {
            var opacity = (1 - dist2 / CONNECT_DIST) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(16, 140, 253, ' + opacity + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
  }

  function initMatrix() {
    var canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var chars = '{ } ( ) ; = > < / if else const let return function class import from async await => try catch';
    var matrixChars = chars.split(' ');
    var fontSize = 14;
    var columns;
    var drops = [];
    var animId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.random() * -canvas.height / fontSize;
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.fillStyle = 'rgba(5, 10, 24, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < drops.length; i++) {
        var text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillStyle = 'rgba(16, 140, 253, 0.35)';
        ctx.font = fontSize + 'px monospace';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          draw();
        } else {
          if (animId) cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(canvas.parentElement);
  }

  function initGlitch() {
    var el = document.querySelector('.glitch');
    if (!el) return;

    function trigger() {
      el.classList.add('is-active');
      setTimeout(function () {
        el.classList.remove('is-active');
      }, 300);
    }

    trigger();
    setInterval(trigger, 5000);
  }

  function initTypewriter() {
    var el = document.getElementById('typeText');
    if (!el) return;

    var phrases = [
      'Desarrollador Web & Software',
      'Especialista en Java & Spring Boot',
      'Apasionado por la IA y tecnología',
      'Freelancer en ASTRACODE VR',
      'Estudiante en TECNM Tlaxiaco'
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var speed = 60;

    function type() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
        setTimeout(type, speed);
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, speed * 0.5);
      }
    }

    type();
  }

  function initParallax() {
    var layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    function update() {
      var scrollY = window.scrollY;
      layers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;
        layer.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
      });
      requestAnimationFrame(update);
    }

    update();
  }

  function initTiltCards() {
    var cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var shine = document.createElement('div');
      shine.className = 'tilt-shine';
      card.appendChild(shine);

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

        var shineX = (x / rect.width) * 100;
        var shineY = (y / rect.height) * 100;
        shine.style.background =
          'radial-gradient(circle at ' + shineX + '% ' + shineY + '%, rgba(255,255,255,0.08) 0%, transparent 60%)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        shine.style.background = 'transparent';
      });
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll('.astrastats__num');
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

      if (target >= 10000) {
        el.textContent = current.toLocaleString() + '+';
      } else if (target === 100) {
        el.textContent = current + '%';
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (target >= 10000) {
          el.textContent = target.toLocaleString() + '+';
        } else if (target === 100) {
          el.textContent = target + '%';
        } else {
          el.textContent = target;
        }
      }
    }

    requestAnimationFrame(step);
  }

  function initNavbar() {
    var nav = document.getElementById('astranav');
    if (!nav) return;

    function checkScroll() {
      if (window.scrollY > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true' ? false : true;
        toggle.setAttribute('aria-expanded', expanded);
        menu.classList.toggle('is-open');
      });

      menu.querySelectorAll('.astranav__link').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
        });
      });
    }
  }

  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSkillsAnimation() {
    var items = document.querySelectorAll('.astraskills__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var progress = parseInt(item.getAttribute('data-progress'), 10) || 0;
      item.style.setProperty('--progress', progress);

      var svg = item.querySelector('svg');
      if (svg && !svg.querySelector('defs')) {
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.id = 'skillGradient';
        grad.setAttribute('x1', '0%');
        grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%');
        grad.setAttribute('y2', '100%');

        var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#108CFD');
        var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#135AD1');

        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);
        svg.insertBefore(defs, svg.firstChild);
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.astraskills__item').forEach(function (item) {
            item.classList.add('is-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    var grid = document.getElementById('skillsGrid');
    if (grid) observer.observe(grid);
  }

  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var inputs = form.querySelectorAll('input, textarea');
    var successEl = document.getElementById('contactSuccess');

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });

      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    function validateField(input) {
      var field = input.closest('.astracontact__field');
      if (!field) return;

      if (input.validity.valid && input.value.trim() !== '') {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        field.classList.remove('is-invalid');
      } else if (input.value.trim() !== '') {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        field.classList.add('is-invalid');
      } else {
        input.classList.remove('is-valid', 'is-invalid');
        field.classList.remove('is-invalid');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      inputs.forEach(function (input) {
        validateField(input);
        if (!input.validity.valid || input.value.trim() === '') {
          valid = false;
          var field = input.closest('.astracontact__field');
          if (field) field.classList.add('is-invalid');
          input.classList.add('is-invalid');
        }
      });

      if (!valid) return;

      var btn = form.querySelector('.astracontact__submit');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Enviando...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var msg = document.getElementById('contactMsg').value.trim();

      var gmailLink =
        'https://mail.google.com/mail/?view=cm&fs=1&to=gibranvasquez5@gmail.com' +
        '&su=' + encodeURIComponent('Mensaje de ' + name + ' - ASTRACODE VR') +
        '&body=' + encodeURIComponent(
          'Nombre: ' + name + '\n' +
          'Email: ' + email + '\n\n' +
          'Mensaje:\n' + msg
        );

      window.open(gmailLink, '_blank');

      if (successEl) successEl.classList.add('is-visible');
      form.reset();
      inputs.forEach(function (inp) {
        inp.classList.remove('is-valid', 'is-invalid');
        var f = inp.closest('.astracontact__field');
        if (f) f.classList.remove('is-invalid');
      });
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Enviar mensaje</span> <i class="fa-solid fa-paper-plane"></i>';
      }
    });
  }

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

  function initCopyright() {
    var footer = document.querySelector('.astrafooter p');
    if (!footer) return;
    footer.textContent = footer.textContent.replace(/\d{4}/, String(new Date().getFullYear()));
  }

  function initBillingToggle() {
    var toggle = document.getElementById('billingToggle');
    if (!toggle) return;

    var labels = document.querySelectorAll('.billing-label');
    var monthlyItems = document.querySelectorAll('.billing-monthly');
    var yearlyItems = document.querySelectorAll('.billing-yearly');

    function setBillingPeriod(isYearly) {
      document.body.classList.toggle('is-billing-yearly', isYearly);
      labels.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('data-period') === (isYearly ? 'yearly' : 'monthly'));
      });
    }

    toggle.addEventListener('click', function () {
      var isYearly = document.body.classList.contains('is-billing-yearly');
      setBillingPeriod(!isYearly);
    });

    setBillingPeriod(false);
  }

  function init() {
    initLoader();
    initCursor();
    initParticles();
    initMatrix();
    initGlitch();
    initTypewriter();
    initParallax();
    initTiltCards();
    initCounters();
    initNavbar();
    initScrollReveal();
    initSkillsAnimation();
    initForm();
    initSmoothNav();
    initCopyright();
    initBillingToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();