(function () {
  const img = document.querySelector(".xd");
  if (!img) return;

  /** Pixels per second along each axis (45° diagonal, down-right). */
  const speed = 140;

  /** Fixed simulation step (seconds). Motion is advanced in these chunks so speed matches all refresh rates and engines. */
  const FIXED_DT = 1 / 60;

  /** After a long pause (tab background), avoid a catch-up spiral. */
  const MAX_FRAME_DT = 0.25;
  const MAX_STEPS_PER_FRAME = 16;

  let vx = speed;
  let vy = speed;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;
  let lastTime = 0;
  let accumulator = 0;
  let raf = 0;

  function syncSize() {
    w = img.offsetWidth;
    h = img.offsetHeight;
  }

  function centerInViewport() {
    syncSize();
    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;
    x = maxX > 0 ? maxX / 2 : 0;
    y = maxY > 0 ? maxY / 2 : 0;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
  }

  function clampPosition() {
    syncSize();
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);
    x = Math.min(Math.max(0, x), maxX);
    y = Math.min(Math.max(0, y), maxY);
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
  }

  function physicsStep(dt) {
    syncSize();
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);

    x += vx * dt;
    y += vy * dt;

    if (x <= 0) {
      x = 0;
      vx = Math.abs(speed);
    }
    if (x >= maxX) {
      x = maxX;
      vx = -Math.abs(speed);
    }
    if (y <= 0) {
      y = 0;
      vy = Math.abs(speed);
    }
    if (y >= maxY) {
      y = maxY;
      vy = -Math.abs(speed);
    }
  }

  function tick() {
    const now = performance.now();
    if (!lastTime) {
      lastTime = now;
    }

    let frameDt = (now - lastTime) / 1000;
    lastTime = now;
    frameDt = Math.min(frameDt, MAX_FRAME_DT);

    accumulator += frameDt;
    const cap = FIXED_DT * MAX_STEPS_PER_FRAME;
    if (accumulator > cap) {
      accumulator = cap;
    }

    let steps = 0;
    while (accumulator >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
      physicsStep(FIXED_DT);
      accumulator -= FIXED_DT;
      steps++;
    }

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    raf = requestAnimationFrame(tick);
  }

  function start() {
    centerInViewport();
    img.classList.add("xd--ready");
    lastTime = 0;
    accumulator = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function onResize() {
    clampPosition();
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    img.addEventListener(
      "load",
      () => {
        centerInViewport();
        img.classList.add("xd--ready");
      },
      { once: true }
    );
    if (img.complete) {
      centerInViewport();
      img.classList.add("xd--ready");
    }
    window.addEventListener("resize", () => {
      centerInViewport();
    });
    return;
  }

  window.addEventListener("resize", onResize);

  if (img.complete) {
    start();
  } else {
    img.addEventListener("load", start, { once: true });
  }
})();
