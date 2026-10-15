'use strict';
// Visual cue only; the native page remains scrollable with mouse, touch or keyboard.
(() => {
  const content = document.querySelector('#content');
  const footer = document.querySelector('.workspace footer');
  const cue = document.createElement('button');
  cue.className = 'scroll-cue';
  cue.type = 'button';
  cue.textContent = 'Pokračuj níže ↓';
  cue.hidden = true;
  cue.setAttribute('aria-label', 'Posunout stránku dolů a zobrazit další obsah');
  document.body.append(cue);
  let frame = 0;
  let step;
  let needsScroll = false;
  function update() {
    frame = 0;
    const coach = content.querySelector('.scroll-coach');
    if (step !== content.dataset.step) {
      step = content.dataset.step;
      needsScroll = false;
      if (coach) coach.hidden = true;
    }
    // Subtract the coach's height without removing it: removing it on every scroll
    // would make the page jump when the pupil reaches the bottom.
    let coachHeight = 0;
    if (coach && !coach.hidden) {
      const intro = coach.closest('.drawing-intro');
      if (intro) {
        // Only the height added to the shared heading row matters. On narrow
        // screens this also includes the gap above the stacked coach.
        coachHeight = Math.max(0, intro.getBoundingClientRect().height
          - intro.querySelector('.drawing-intro-text').getBoundingClientRect().height);
      } else {
        const style = getComputedStyle(coach);
        coachHeight = coach.getBoundingClientRect().height
          + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
    }
    const end = footer.getBoundingClientRect().bottom;
    needsScroll = end + window.scrollY - coachHeight > window.innerHeight + 12;
    if (coach) coach.hidden = !needsScroll;
    const pad = document.querySelector('#keypad');
    cue.hidden = footer.getBoundingClientRect().bottom <= window.innerHeight + 12
      || (pad && !pad.hidden);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  cue.addEventListener('click', () => window.scrollBy({
    top: window.innerHeight * .7,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  }));
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  // Render, feedback, keypad visibility and image loading can change the layout.
  new MutationObserver(schedule).observe(content, {childList:true, subtree:true, characterData:true});
  new MutationObserver(schedule).observe(document.querySelector('#keypad'), {attributes:true, attributeFilter:['hidden']});
  content.addEventListener('load', schedule, true);
  schedule();
})();
