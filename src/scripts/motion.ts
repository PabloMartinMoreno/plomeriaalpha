// Motion system — vanilla, dependency-free, RM-safe
// Activates on DOMContentLoaded, no-op if prefers-reduced-motion

const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─────────────────────────────────────────────── scroll progress bar
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText =
    'position:fixed;top:0;left:0;height:2px;width:0;z-index:60;' +
    'background:linear-gradient(90deg,var(--color-brand-600),var(--color-accent-500));' +
    'transform-origin:left;transition:opacity 300ms;pointer-events:none';
  document.body.appendChild(bar);
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - window.innerHeight;
    const p = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${p}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ─────────────────────────────────────────────── custom cursor
function initCustomCursor() {
  if (!isFinePointer) return;
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
  });

  const tick = () => {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const hoverables = 'a, button, [data-magnetic], details > summary, input, textarea, label';
  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    if (t.closest?.(hoverables)) ring.classList.add('is-active');
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target as Element;
    if (t.closest?.(hoverables)) ring.classList.remove('is-active');
  });

  document.addEventListener('pointerleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('pointerenter', () => {
    dot.style.opacity = '';
    ring.style.opacity = '';
  });
}

// ─────────────────────────────────────────────── magnetic hover
function initMagnetic() {
  if (!isFinePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.25);
    let rx = 0, ry = 0, tx = 0, ty = 0;
    let raf = 0;
    const tick = () => {
      rx = lerp(rx, tx, 0.18);
      ry = lerp(ry, ty, 0.18);
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(rx - tx) > 0.1 || Math.abs(ry - ty) > 0.1) {
        raf = requestAnimationFrame(tick);
      }
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) * strength;
      ty = (e.clientY - r.top - r.height / 2) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
    el.addEventListener('pointerleave', () => {
      tx = 0; ty = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
  });
}

// ─────────────────────────────────────────────── text split reveal
function initSplitText() {
  const targets = document.querySelectorAll<HTMLElement>('[data-split]');
  targets.forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const mode = el.dataset.split || 'words';
    const source = Array.from(el.childNodes);
    const fragments: Node[] = [];
    source.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (mode === 'chars') {
          for (const ch of text) {
            const span = document.createElement('span');
            span.className = 'split-char';
            const inner = document.createElement('span');
            inner.className = 'split-inner';
            inner.textContent = ch === ' ' ? ' ' : ch;
            span.appendChild(inner);
            fragments.push(span);
          }
        } else {
          const words = text.split(/(\s+)/);
          for (const w of words) {
            if (w.trim() === '') {
              fragments.push(document.createTextNode(w));
            } else {
              const span = document.createElement('span');
              span.className = 'split-word';
              const inner = document.createElement('span');
              inner.className = 'split-inner';
              inner.textContent = w;
              span.appendChild(inner);
              fragments.push(span);
            }
          }
        }
      } else {
        fragments.push(node);
      }
    });
    el.replaceChildren(...fragments);
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
}

// ─────────────────────────────────────────────── parallax
function initParallax() {
  if (isReduced) return;
  const items = document.querySelectorAll<HTMLElement>('[data-parallax]');
  const update = () => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const progress = (center - vh / 2) / vh;
      const speed = Number(el.dataset.parallax || 0.15);
      el.style.transform = `translate3d(0, ${progress * -speed * 100}px, 0)`;
    });
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ─────────────────────────────────────────────── spring tilt
function initTilt() {
  if (!isFinePointer || isReduced) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    let tx = 0, ty = 0, rx = 0, ry = 0, z = 0, rz = 0;
    let raf = 0;
    let active = false;
    const max = Number(el.dataset.tilt || 6);

    const tick = () => {
      rx = lerp(rx, tx, 0.14);
      ry = lerp(ry, ty, 0.14);
      rz = lerp(rz, z, 0.14);
      el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${rz}px)`;
      if (active || Math.abs(rx - tx) > 0.05 || Math.abs(ry - ty) > 0.05 || Math.abs(rz - z) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        el.style.transform = '';
      }
    };
    el.addEventListener('pointerenter', () => {
      active = true;
      z = 8;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tx = -py * max;
      ty = px * max;
    });
    el.addEventListener('pointerleave', () => {
      active = false;
      tx = 0; ty = 0; z = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });
  });
}

// ─────────────────────────────────────────────── reveal on scroll
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el));
}

// ─────────────────────────────────────────────── counter
function initCounter() {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      const target = Number(el.dataset.counter);
      if (!Number.isFinite(target)) continue;
      const duration = 1800;
      const start = performance.now();
      const startText = el.textContent?.trim() ?? '';
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(eased * target);
        el.textContent = val.toLocaleString('es-AR');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = startText;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    }
  }, { threshold: 0.5 });
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((c) => io.observe(c));
}

// ─────────────────────────────────────────────── hero intro
function initHeroIntro() {
  const root = document.querySelector<HTMLElement>('[data-hero]');
  if (!root) return;
  requestAnimationFrame(() => root.classList.add('is-loaded'));
}

// ─────────────────────────────────────────────── marquee hover pause
function initMarqueeHover() {
  document.querySelectorAll<HTMLElement>('.marquee-track, .marquee-track-slow').forEach((el) => {
    el.addEventListener('pointerenter', () => { el.style.animationPlayState = 'paused'; });
    el.addEventListener('pointerleave', () => { el.style.animationPlayState = ''; });
  });
}

// ─────────────────────────────────────────────── smooth scroll anchor
function initSmoothAnchor() {
  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    const a = t.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href')?.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });
}

// ─────────────────────────────────────────────── boot
function boot() {
  initReveal();
  initCounter();
  initScrollProgress();
  initHeroIntro();
  initMarqueeHover();
  initSmoothAnchor();
  if (!isReduced) {
    initSplitText();
    initParallax();
    initTilt();
    initMagnetic();
    if (isFinePointer) initCustomCursor();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
