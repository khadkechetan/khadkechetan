// Neural-network particle background for the hero section.
(function () {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null };
  var rafId = null;
  var LINK_DIST = 130;
  var MOUSE_DIST = 150;

  function nodeCount() {
    return window.innerWidth < 768 ? 40 : 80;
  }

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function seed() {
    particles = [];
    var count = nodeCount();
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 1.8
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Gentle mouse repulsion
      if (mouse.x !== null) {
        var dxm = p.x - mouse.x;
        var dym = p.y - mouse.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < MOUSE_DIST && dm > 0.001) {
          p.x += (dxm / dm) * 0.6;
          p.y += (dym / dm) * 0.6;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.35 * (1 - d / LINK_DIST)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function drawStatic() {
    // Reduced motion: render one still frame instead of animating.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.fill();
    }
  }

  function start() {
    if (rafId === null && !reduceMotion) rafId = requestAnimationFrame(step);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  resize();
  seed();

  if (reduceMotion) {
    drawStatic();
  } else {
    start();

    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause when the tab is hidden or the hero is scrolled out of view.
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(canvas.parentElement);
    }
  }

  window.addEventListener('resize', function () {
    resize();
    seed();
    if (reduceMotion) drawStatic();
  });
})();
