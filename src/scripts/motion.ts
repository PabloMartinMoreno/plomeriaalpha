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

// ─────────────────────────────────────────────── open-now indicator
type OpenHours = { opens: string; closes: string; days: number[] };
function initOpenNow() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-open-now]');
  if (!nodes.length) return;
  const hm = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  nodes.forEach((el) => {
    const raw = el.dataset.openNow;
    if (!raw) return;
    let spec: OpenHours;
    try { spec = JSON.parse(raw); } catch { return; }
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const openNow = spec.days.includes(now.getDay()) && mins >= hm(spec.opens) && mins < hm(spec.closes);
    el.dataset.state = openNow ? 'open' : 'closed';
    const label = el.querySelector<HTMLElement>('[data-open-label]');
    if (label) label.textContent = openNow ? 'Abierto ahora' : 'Urgencias 24/7';
  });
}

// ─────────────────────────────────────────────── contact form
function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  // pre-fill from URL params (?servicio=gas, ?zona=martinez, ?detalle=…)
  try {
    const params = new URLSearchParams(window.location.search);
    const servicioSlug = params.get('servicio');
    const zonaSlug = params.get('zona');
    const detalle = params.get('detalle');
    const msgInput = form.querySelector<HTMLTextAreaElement>('[name="message"]');
    const areaInput = form.querySelector<HTMLInputElement>('[name="area"]');
    if (servicioSlug && msgInput && !msgInput.value) {
      const pretty = servicioSlug.replace(/-/g, ' ');
      msgInput.value = `Necesito ${pretty}.${detalle ? ` ${detalle}` : ''}`;
    } else if (detalle && msgInput && !msgInput.value) {
      msgInput.value = detalle;
    }
    if (zonaSlug && areaInput && !areaInput.value) {
      areaInput.value = zonaSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    if (servicioSlug || zonaSlug) {
      const anchor = form.closest('#contacto') as HTMLElement | null;
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch {}
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const setStatus = (msg: string, ok: boolean) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = ok ? 'rgb(16 122 81)' : 'rgb(190 49 49)';
  };
  form.addEventListener('submit', async (e) => {
    const honeypot = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
    if (honeypot?.value) { e.preventDefault(); return; }
    if (form.dataset.formConfigured === 'false') {
      e.preventDefault();
      setStatus('Formulario no configurado todavía — escribinos por WhatsApp.', false);
      return;
    }
    e.preventDefault();
    setStatus('Enviando…', true);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        setStatus('Recibido. Te contactamos en el día.', true);
        const plausible = (window as any).plausible;
        if (typeof plausible === 'function') plausible('form:submit', { props: { location: window.location.pathname } });
        const nextInput = form.querySelector<HTMLInputElement>('input[name="_next"]');
        if (nextInput?.value) window.location.assign(nextInput.value);
      } else {
        setStatus('No se pudo enviar. Probá por WhatsApp.', false);
      }
    } catch {
      setStatus('Error de red. Probá por WhatsApp.', false);
    }
  });
}

// ─────────────────────────────────────────────── quick wizard
function initQuickWizard() {
  const root = document.querySelector<HTMLElement>('[data-wizard]');
  if (!root) return;
  const phone = root.dataset.phone;
  if (!phone) return;
  const state: { service?: string; serviceSlug?: string; zone?: string; zoneSlug?: string; urgency?: 'urgencia' | 'programado'; notes?: string } = {};
  let step = 1;

  const slots = [1, 2, 3].map((n) => root.querySelector<HTMLElement>(`[data-wizard-slot="${n}"]`));
  const bars = [1, 2, 3].map((n) => root.querySelector<HTMLElement>(`[data-wizard-bar="${n}"]`));
  const label = root.querySelector<HTMLElement>('[data-wizard-step-label]');
  const back = root.querySelector<HTMLButtonElement>('[data-wizard-back]');
  const reset = root.querySelector<HTMLButtonElement>('[data-wizard-reset]');
  const notes = root.querySelector<HTMLTextAreaElement>('[data-wizard-notes]');

  const render = () => {
    slots.forEach((s, i) => s?.classList.toggle('hidden', i + 1 !== step));
    bars.forEach((b, i) => {
      if (!b) return;
      b.classList.toggle('bg-ink', i + 1 <= step);
      b.classList.toggle('bg-slate-200', i + 1 > step);
    });
    if (label) label.textContent = `Paso ${step} de 3`;
    if (back) {
      back.classList.toggle('hidden', step === 1);
      back.classList.toggle('inline-flex', step > 1);
    }
    if (reset) {
      reset.classList.toggle('hidden', step === 1);
      reset.classList.toggle('inline-flex', step > 1);
    }
  };

  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-wizard-option]');
    if (!t) return;
    const kind = t.dataset.wizardOption;
    const value = t.dataset.value;
    const slug = t.dataset.slug;
    if (kind === 'service' && value) { state.service = value; state.serviceSlug = slug; step = 2; }
    else if (kind === 'zone' && value) { state.zone = value; state.zoneSlug = slug; step = 3; }
    else if (kind === 'urgency' && (value === 'urgencia' || value === 'programado')) { state.urgency = value; }
    render();
    if (kind === 'urgency') {
      root.querySelectorAll<HTMLElement>('[data-wizard-option="urgency"]').forEach((b) => {
        b.style.borderColor = b.dataset.value === state.urgency
          ? (state.urgency === 'urgencia' ? 'rgb(245 158 11)' : 'rgb(11 18 32)')
          : '';
      });
    }
  });

  back?.addEventListener('click', () => { if (step > 1) { step -= 1; render(); } });
  reset?.addEventListener('click', () => { step = 1; state.service = state.zone = state.urgency = state.notes = undefined; state.serviceSlug = state.zoneSlug = undefined; if (notes) notes.value = ''; render(); });

  root.querySelector<HTMLButtonElement>('[data-wizard-submit]')?.addEventListener('click', () => {
    state.notes = notes?.value.trim() || undefined;
    const lines = ['Hola, consulta desde la web:'];
    if (state.service) lines.push(`· Servicio: ${state.service}`);
    if (state.zone) lines.push(`· Zona: ${state.zone}`);
    if (state.urgency) lines.push(`· Tipo: ${state.urgency === 'urgencia' ? 'Urgencia' : 'Programado'}`);
    if (state.notes) lines.push(`· Detalle: ${state.notes}`);
    const msg = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${phone}?text=${msg}&utm_source=web&utm_content=wizard`;
    window.dispatchEvent(new CustomEvent('track', { detail: { event: 'cta:wizard:whatsapp', state } }));
    window.open(url, '_blank', 'noopener');
  });

  render();
}

// ─────────────────────────────────────────────── mini wizard (service detail)
function initMiniWizard() {
  const root = document.querySelector<HTMLElement>('[data-mini-wizard]');
  if (!root) return;
  const phone = root.dataset.phone || '';
  const service = root.dataset.service || '';
  const slug = root.dataset.serviceSlug || '';
  const zonePreset = root.dataset.zonePreset === 'true';
  const presetZoneName = root.dataset.zoneName || '';
  const presetZoneSlug = root.dataset.zoneSlug || '';
  const state: { zone?: string; urgency?: 'urgencia' | 'programado' } = {};
  if (zonePreset && presetZoneName) state.zone = presetZoneName;
  let step: 1 | 2 = zonePreset ? 2 : 1;
  const totalSteps = zonePreset ? 1 : 2;

  const slots = Array.from(root.querySelectorAll<HTMLElement>('[data-mini-slot]'));
  const bars = Array.from(root.querySelectorAll<HTMLElement>('[data-mini-bar]'));
  const label = root.querySelector<HTMLElement>('[data-mini-step-label]');
  const backBtn = root.querySelector<HTMLButtonElement>('[data-mini-back]');

  const render = () => {
    slots.forEach((s) => s.classList.toggle('hidden', Number(s.dataset.miniSlot) !== step));
    bars.forEach((b) => {
      const n = Number(b.dataset.miniBar);
      b.classList.toggle('bg-ink', n <= step);
      b.classList.toggle('bg-slate-200', n > step);
    });
    const shown = zonePreset ? 1 : step;
    if (label) label.textContent = `Paso ${shown} de ${totalSteps}`;
    if (backBtn) {
      const canBack = !zonePreset && step > 1;
      backBtn.classList.toggle('hidden', !canBack);
      backBtn.classList.toggle('inline-flex', canBack);
    }
  };

  const submit = () => {
    const lines = ['Hola, consulta desde la web:', `· Servicio: ${service}`];
    if (state.zone) lines.push(`· Zona: ${state.zone}`);
    if (state.urgency) lines.push(`· Tipo: ${state.urgency === 'urgencia' ? 'Urgencia' : 'Programado'}`);
    const msg = lines.join('\n');
    const src = zonePreset ? `cross-wizard-${slug}-${presetZoneSlug}` : `mini-wizard-${slug}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}&utm_source=web&utm_content=${encodeURIComponent(src)}`;
    const plausible = (window as any).plausible;
    if (typeof plausible === 'function') plausible('wizard:complete', { props: { service: slug, zone: state.zone || '', urgency: state.urgency || '' } });
    window.open(url, '_blank', 'noopener');
  };

  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-mini-option]');
    if (!btn) return;
    const opt = btn.dataset.miniOption;
    const value = btn.dataset.value || '';
    if (opt === 'zone') {
      state.zone = value;
      step = 2;
      render();
    } else if (opt === 'urgency') {
      state.urgency = value as 'urgencia' | 'programado';
      submit();
    }
  });

  backBtn?.addEventListener('click', () => {
    if (step > 1) {
      step = (step - 1) as 1 | 2;
      render();
    }
  });

  render();
}

// ─────────────────────────────────────────────── cookie consent
function initCookieBanner() {
  const banner = document.querySelector<HTMLElement>('[data-cookie-banner]');
  if (!banner) return;
  let stored: string | null = null;
  try { stored = localStorage.getItem('cookie-consent'); } catch {}
  if (!stored) banner.hidden = false;
  const persist = (value: 'accepted' | 'rejected') => {
    try { localStorage.setItem('cookie-consent', value); } catch {}
    banner.hidden = true;
    if (value === 'accepted' && typeof (window as any).__loadClarity === 'function') {
      (window as any).__loadClarity();
    }
  };
  banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => persist('accepted'));
  banner.querySelector('[data-cookie-reject]')?.addEventListener('click', () => persist('rejected'));
}

// ─────────────────────────────────────────────── header compact on scroll
function initHeaderCompact() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const inner = document.querySelector<HTMLElement>('[data-header-inner]');
  if (!header || !inner) return;
  const threshold = 24;
  const update = () => {
    const compact = window.scrollY > threshold;
    header.dataset.compact = compact ? 'true' : 'false';
    inner.dataset.compact = compact ? 'true' : 'false';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// ─────────────────────────────────────────────── scroll depth tracking
function initScrollDepth() {
  const marks = [25, 50, 75, 90];
  const fired = new Set<number>();
  const onScroll = () => {
    const doc = document.documentElement;
    const h = doc.scrollHeight - doc.clientHeight;
    if (h <= 0) return;
    const pct = Math.round((doc.scrollTop / h) * 100);
    for (const m of marks) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        const plausible = (window as any).plausible;
        if (typeof plausible === 'function') plausible('scroll', { props: { depth: String(m) } });
      }
    }
    if (fired.size === marks.length) window.removeEventListener('scroll', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─────────────────────────────────────────────── CTA event tracking
function initTrackCTAs() {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (!el) return;
    const name = el.dataset.track;
    if (!name) return;
    const plausible = (window as any).plausible;
    if (typeof plausible === 'function') plausible(name, { props: { href: (el as HTMLAnchorElement).href || '' } });
    window.dispatchEvent(new CustomEvent('track', { detail: { event: name } }));
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
  initOpenNow();
  initContactForm();
  initQuickWizard();
  initMiniWizard();
  initScrollDepth();
  initHeaderCompact();
  initCookieBanner();
  initTrackCTAs();
  if (!isReduced) {
    initSplitText();
    initParallax();
    initTilt();
    initMagnetic();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
