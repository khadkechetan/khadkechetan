// Scroll reveals, stat counters, nav behavior, project tilt, copy-email.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---- Stat counters ----
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    var duration = 1500;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  // ---- Mobile nav toggle ----
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Active nav link ----
  var sections = document.querySelectorAll('section[id], header[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  // ---- 3D tilt on project cards (pointer devices only) ----
  if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'perspective(700px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 7) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ---- Copy email ----
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('khadkechetan@gmail.com').then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Copied! ✓';
        setTimeout(function () { copyBtn.textContent = original; }, 2000);
      });
    });
  }

  // ---- Footer year ----
  document.getElementById('year').textContent = new Date().getFullYear();
})();
