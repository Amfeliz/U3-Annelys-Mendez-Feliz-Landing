/* ═══════════════════════════════════════════════
   CONECTANDO — Digital  |  script.js  v6
   ═══════════════════════════════════════════════ */

/* Requerimos el Plugin de Texto para la animación Typewriter */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ────────────────────────────────────────────────
   SCROLL REVEAL (Apariciones Generales)
   ──────────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ────────────────────────────────────────────────
   EFECTO TYPEWRITER (TRANSFORMA, DECIDE, AVANZA)
   ──────────────────────────────────────────────── */
const verbLines = document.querySelectorAll('.verb-line');
verbLines.forEach((verb, i) => {
  const textToType = verb.getAttribute('data-text');
  
  ScrollTrigger.create({
    trigger: ".fundamento-verbs",
    start: "top 75%",
    onEnter: () => {
      gsap.to(verb, {
        duration: 1,
        text: textToType,
        ease: "power1.inOut",
        delay: i * 0.6 // Cascada progresiva
      });
    }
  });
});

/* ────────────────────────────────────────────────
   HEADER DOTS — Navegación de 7 secciones
   ──────────────────────────────────────────────── */
const SECTIONS = [
  'section-hero',
  'section-fundamento',
  'section-conceptos',
  'section-galeria',
  'section-partitura',
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
   PARALLAX SUAVE — piezas hero
   ──────────────────────────────────────────────── */
const heroPieces = document.getElementById('hero-pieces');

document.addEventListener('mousemove', e => {
  const cx = (e.clientX / window.innerWidth  - 0.5);
  const cy = (e.clientY / window.innerHeight - 0.5);

  /* Piezas: se mueven ligeramente en dirección opuesta al cursor */
  if (heroPieces) {
    heroPieces.style.transform = `translate(${cx * -10}px, ${cy * -6}px)`;
  }
});

/* ────────────────────────────────────────────────
   CONCEPT CARDS — color en hover
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
    // Zoom suave solo a la imagen de fondo (la foto)
    const photo = img.querySelector('.gal-photo');
    if (photo) photo.style.transform = 'scale(1.05)';
  });
  img.addEventListener('mouseleave', () => {
    const photo = img.querySelector('.gal-photo');
    if (photo) photo.style.transform = '';
  });
});