// Typing/deleting rotation for the hero role line.
(function () {
  var el = document.getElementById('typingText');
  if (!el) return;

  var phrases = [
    'Staff Software Engineer',
    'LLM & Agentic AI',
    'NLP & Document AI',
    'Staff Software Engineer @ Xpanse'
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  var phraseIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function tick() {
    var phrase = phrases[phraseIndex];

    if (deleting) {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    } else {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 75);
    }
  }

  tick();
})();
