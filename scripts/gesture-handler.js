/* Simple gestures: swipe from left edge = back, swipe up from bottom = home */

window.MindsEyeGestures = (() => {
  let startX = 0;
  let startY = 0;
  let active = false;

  function attach(el, onBack, onHome) {
    el.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      active = true;
    }, { passive: true });

    el.addEventListener("touchmove", (e) => {
      if (!active) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // left-edge swipe right => back
      if (startX < 24 && dx > 80 && Math.abs(dy) < 60) {
        active = false;
        onBack();
      }

      // bottom swipe up => home
      const height = el.getBoundingClientRect().height;
      if (startY > (height - 24) && dy < -90 && Math.abs(dx) < 80) {
        active = false;
        onHome();
      }
    }, { passive: true });

    el.addEventListener("touchend", () => { active = false; }, { passive: true });
  }

  return { attach };
})();
