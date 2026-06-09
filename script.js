/* ═══════════════════════════════════════════════
   CONECTANDO — Digital  |  script.js  v4
   ═══════════════════════════════════════════════ */

/* ────────────────────────────────────────────────
   SCROLL REVEAL
   ──────────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ────────────────────────────────────────────────
   HEADER DOTS — sección activa + click navega
   ──────────────────────────────────────────────── */
const SECTIONS = [
  'section-hero',
  'section-fundamento',
  'section-conceptos',
  'section-galeria',
  'section-conceptos-clave',
  'section-cta'
];
const dots = document.querySelectorAll('.header-dots span');

const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const idx = SECTIONS.indexOf(e.target.id);
    if (idx < 0) return;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  });
}, { threshold: 0.35 });

SECTIONS.forEach(id => {
  const el = document.getElementById(id);
  if (el) secObs.observe(el);
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    const el = document.getElementById(SECTIONS[i]);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────────
   PARALLAX SUAVE — piezas hero + verbos
   ──────────────────────────────────────────────── */
const heroPieces = document.getElementById('hero-pieces');
const verbLines  = document.querySelectorAll('.verb-line');

document.addEventListener('mousemove', e => {
  const cx = (e.clientX / window.innerWidth  - 0.5);
  const cy = (e.clientY / window.innerHeight - 0.5);

  /* Piezas: se mueven ligeramente en dirección opuesta al cursor */
  if (heroPieces) {
    heroPieces.style.transform = `translate(${cx * -10}px, ${cy * -6}px)`;
  }

  /* Verbos: ligero desplazamiento horizontal alternado */
  verbLines.forEach((v, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    v.style.transform = `translateX(${cx * 12 * dir}px)`;
  });
});

/* ────────────────────────────────────────────────
   CONCEPT CARDS — color en hover según posición
   ──────────────────────────────────────────────── */
const CARD_COLORS = [
  '#FFED00','#E6007E','#009FE3',
  '#FFED00','#E6007E','#009FE3',
  '#FFED00','#E6007E'
];

document.querySelectorAll('.concept-card').forEach((card, i) => {
  const color = CARD_COLORS[i % CARD_COLORS.length];
  card.addEventListener('mouseenter', () => {
    card.style.borderColor     = color;
    card.style.borderLeftWidth = '3px';
    card.style.borderLeftColor = color;
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor     = '';
    card.style.borderLeftWidth = '';
    card.style.borderLeftColor = '';
  });
});

/* ────────────────────────────────────────────────
   CTA — efecto magnético suave
   ──────────────────────────────────────────────── */
const ctaBtn = document.getElementById('cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('mousemove', e => {
    const rect = ctaBtn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 15;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    ctaBtn.style.transform = `translate(${x}px, ${y}px)`;
  });
  ctaBtn.addEventListener('mouseleave', () => {
    ctaBtn.style.transform = '';
  });
}

/* ────────────────────────────────────────────────
   GALERÍA — hover zoom sutil
   ──────────────────────────────────────────────── */
document.querySelectorAll('.gal-img').forEach(img => {
  img.addEventListener('mouseenter', () => {
    img.style.transition = 'transform 0.4s ease';
    img.querySelector('.board-sim, .box-sim, .box2-sim') &&
      (img.querySelector('.board-sim, .box-sim, .box2-sim').style.transform = 'scale(1.03)');
  });
  img.addEventListener('mouseleave', () => {
    img.querySelector('.board-sim, .box-sim, .box2-sim') &&
      (img.querySelector('.board-sim, .box-sim, .box2-sim').style.transform = '');
  });
});