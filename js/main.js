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
    var mouse = { x: -9999, y: -9999 };
    var animId;
    var time = 0;
    var gridSize = 70;
    var nodes = [];
    var circuits = [];
    var packets = [];
    var floaters = [];
    var symbols = ['{', '}', '<', '>', '/', '=', '0x1F', '0xFF', '&&', '||', '=>', '[]', '/*', '*/'];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildScene();
    }

    function buildScene() {
      nodes = [];
      circuits = [];
      packets = [];
      floaters = [];

      var cols = Math.ceil(canvas.width / gridSize) + 1;
      var rows = Math.ceil(canvas.height / gridSize) + 1;

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          if (Math.random() > 0.35) {
            nodes.push({
              bx: c * gridSize + gridSize / 2,
              by: r * gridSize + gridSize / 2,
              x: c * gridSize + gridSize / 2,
              y: r * gridSize + gridSize / 2,
              size: 1.5 + Math.random() * 2.5,
              phase: Math.random() * Math.PI * 2,
              speed: 0.01 + Math.random() * 0.03,
              links: 0
            });
          }
        }
      }

      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].bx - nodes[j].bx;
          var dy = nodes[i].by - nodes[j].by;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < gridSize * 1.5 && dist > 0 && Math.random() > 0.55) {
            nodes[i].links++;
            nodes[j].links++;
            circuits.push({
              a: nodes[i], b: nodes[j],
              alpha: 0.08 + Math.random() * 0.2,
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }

      for (var k = 0; k < 18; k++) {
        var ci = Math.floor(Math.random() * circuits.length);
        if (circuits[ci]) {
          packets.push({
            circuit: circuits[ci],
            t: Math.random(),
            dir: Math.random() > 0.5 ? 1 : -1,
            speed: 0.004 + Math.random() * 0.008,
            size: 2 + Math.random() * 3
          });
        }
      }

      for (var f = 0; f < 25; f++) {
        floaters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          text: symbols[Math.floor(Math.random() * symbols.length)],
          size: 11 + Math.random() * 14,
          speed: 0.15 + Math.random() * 0.35,
          drift: Math.random() * 0.4 - 0.2,
          alpha: 0.02 + Math.random() * 0.04
        });
      }
    }

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function ptOnCurve(p0, p1, p2, p3, t) {
      var u = 1 - t;
      return {
        x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
        y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
      };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      var gw = canvas.width;
      var gh = canvas.height;

      // --- background grid ---
      ctx.strokeStyle = 'rgba(16, 140, 253, 0.03)';
      ctx.lineWidth = 1;
      var off = (time * 0.15) % gridSize;
      for (var x = -gridSize + off; x < gw + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, gh);
        ctx.stroke();
      }
      for (var y = -gridSize + off; y < gh + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(gw, y);
        ctx.stroke();
      }

      // --- diagonal accent lines ---
      ctx.strokeStyle = 'rgba(16, 140, 253, 0.015)';
      ctx.lineWidth = 1;
      var dOff = (time * 0.05) % (gridSize * 2);
      for (var d = -gw - gh; d < gw + gh; d += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(d + dOff, 0);
        ctx.lineTo(d + dOff + gh, gh);
        ctx.stroke();
      }

      // --- circuits ---
      for (var ci = 0; ci < circuits.length; ci++) {
        var circ = circuits[ci];
        var breath = 0.5 + Math.sin(time * 0.015 + circ.phase) * 0.3;
        var alpha = circ.alpha * breath;
        if (alpha < 0.01) continue;

        var a = circ.a, b = circ.b;

        if (ci % 2 === 0) {
          var cx = (a.x + b.x) / 2 + Math.sin(ci) * 25;
          var cy = (a.y + b.y) / 2 + Math.cos(ci) * 25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(cx, cy, b.x, b.y);
          ctx.strokeStyle = 'rgba(16, 140, 253, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(16, 140, 253, ' + (alpha * 0.7) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // --- data packets ---
      for (var pi = 0; pi < packets.length; pi++) {
        var pkt = packets[pi];
        var c = pkt.circuit;
        if (!c) continue;

        pkt.t += pkt.speed * pkt.dir;
        if (pkt.t > 1) { pkt.t = 1; pkt.dir = -1; }
        if (pkt.t < 0) { pkt.t = 0; pkt.dir = 1; }

        var t = pkt.t;
        var px, py;

        if (pi % 2 === 0) {
          var cx = (c.a.x + c.b.x) / 2 + Math.sin(pi) * 25;
          var cy = (c.a.y + c.b.y) / 2 + Math.cos(pi) * 25;
          var u = 1 - t;
          px = u*u*c.a.x + 2*u*t*cx + t*t*c.b.x;
          py = u*u*c.a.y + 2*u*t*cy + t*t*c.b.y;
        } else {
          px = c.a.x + (c.b.x - c.a.x) * t;
          py = c.a.y + (c.b.y - c.a.y) * t;
        }

        var glow = ctx.createRadialGradient(px, py, 0, px, py, pkt.size * 4);
        glow.addColorStop(0, 'rgba(16, 140, 253, 0.9)');
        glow.addColorStop(0.3, 'rgba(16, 140, 253, 0.3)');
        glow.addColorStop(1, 'rgba(16, 140, 253, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, pkt.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(px, py, pkt.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- nodes ---
      for (var ni = 0; ni < nodes.length; ni++) {
        var n = nodes[ni];
        var pulse = Math.sin(time * n.speed + n.phase);
        n.phase += n.speed;
        n.phase = n.phase % (Math.PI * 2);

        // mouse repulsion
        var mdx = n.x - mouse.x;
        var mdy = n.y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 180 && mDist > 0) {
          var f = (180 - mDist) / 180 * 25;
          n.x += (mdx / mDist) * f;
          n.y += (mdy / mDist) * f;
        }
        n.x += (n.bx - n.x) * 0.06;
        n.y += (n.by - n.y) * 0.06;

        var rad = n.size * (0.7 + pulse * 0.3);
        var alpha = 0.5 + pulse * 0.3;

        // glow
        var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rad * 8);
        g.addColorStop(0, 'rgba(16, 140, 253, ' + (0.35 * alpha) + ')');
        g.addColorStop(1, 'rgba(16, 140, 253, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad * 8, 0, Math.PI * 2);
        ctx.fill();

        // outer ring
        ctx.strokeStyle = 'rgba(16, 140, 253, ' + (0.3 * alpha) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad * 2, 0, Math.PI * 2);
        ctx.stroke();

        // core
        ctx.fillStyle = 'rgba(16, 140, 253, ' + (0.7 + pulse * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
        ctx.fill();

        // white inner core for hub nodes
        if (n.links > 3) {
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.4 + pulse * 0.3) + ')';
          ctx.beginPath();
          ctx.arc(n.x, n.y, rad * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- floating tech symbols ---
      for (var fi = 0; fi < floaters.length; fi++) {
        var fl = floaters[fi];
        fl.y -= fl.speed;
        fl.x += Math.sin(time * 0.008 + fi * 2) * fl.drift * 0.5;

        if (fl.y < -40) {
          fl.y = gh + 40;
          fl.x = Math.random() * gw;
        }
        if (fl.x < -40) fl.x = gw + 40;
        if (fl.x > gw + 40) fl.x = -40;

        ctx.font = fl.size + 'px "Fira Code", monospace';
        ctx.fillStyle = 'rgba(16, 140, 253, ' + fl.alpha + ')';
        ctx.fillText(fl.text, fl.x, fl.y);
      }

      // --- HUD corner brackets ---
      var s = 35, m = 25;
      ctx.strokeStyle = 'rgba(16, 140, 253, 0.12)';
      ctx.lineWidth = 2;

      ctx.beginPath(); ctx.moveTo(m, m + s); ctx.lineTo(m, m); ctx.lineTo(m + s, m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gw - m - s, m); ctx.lineTo(gw - m, m); ctx.lineTo(gw - m, m + s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m, gh - m - s); ctx.lineTo(m, gh - m); ctx.lineTo(m + s, gh - m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gw - m - s, gh - m); ctx.lineTo(gw - m, gh - m); ctx.lineTo(gw - m, gh - m - s); ctx.stroke();

      // --- HUD labels ---
      ctx.font = '9px "Fira Code", monospace';
      ctx.fillStyle = 'rgba(16, 140, 253, 0.08)';
      ctx.fillText('SYS::ONLINE', m + 4, m + 12);
      ctx.textAlign = 'right';
      ctx.fillText('NODES:' + nodes.length, gw - m - 4, m + 12);
      ctx.fillText('v2.0.1', gw - m - 4, gh - m - 4);
      ctx.textAlign = 'left';
      ctx.fillText('ASTRACODE VR', m + 4, gh - m - 4);

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