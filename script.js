/* ═══════════════════════════════════════════════
   CONECTANDO — Digital  |  script.js 
   ═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Bloqueamos el scroll mientras carga
document.body.style.overflow = 'hidden';
window.scrollTo(0, 0);

/* ────────────────────────────────────────────────
   ANIMACIÓN PANTALLA DE CARGA (LOADER)
   ──────────────────────────────────────────────── */
const loader = document.getElementById('loader');
const pctText = document.getElementById('loader-pct');
const squares = document.querySelectorAll('.sq');
const brandColors = ['#FFED00', '#E6007E', '#009FE3']; 

let loaderObj = { val: 0 };

gsap.to(loaderObj, {
  val: 100,
  duration: 2.5,
  ease: "power1.inOut",
  onUpdate: () => {
    let percent = Math.round(loaderObj.val);
    pctText.innerText = percent + "%";

    let activeSquares = Math.floor((percent / 100) * squares.length);
    squares.forEach((sq, i) => {
      if (i < activeSquares) {
        sq.style.background = brandColors[i % brandColors.length];
      }
    });
  },
  onComplete: () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        loader.style.display = 'none';
        document.body.style.overflow = ''; 
        initSiteAnimations(); 
      }
    });
  }
});

/* ────────────────────────────────────────────────
   INICIALIZACIÓN DE LA PÁGINA 
   ──────────────────────────────────────────────── */
function initSiteAnimations() {

  // 1. SCROLL REVEAL (Apariciones Generales)
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // 2. EFECTO TYPEWRITER (TRANSFORMA, DECIDE, AVANZA)
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
          delay: i * 0.6 
        });
      }
    });
  });

  // 3. EFECTO DECODIFICACIÓN INTERCALADO (Textos en Formas)
  const shapes = [
    '<svg class="g-shp" viewBox="0 0 30 20"><path d="M1,1 H29 V9 H19 V19 H9 V9 H1 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 30 10"><rect x="1" y="1" width="28" height="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 20 30"><path d="M1,1 H9 V19 H19 V29 H1 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 20 10"><rect x="1" y="1" width="18" height="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 20 20"><path d="M1,1 H9 V9 H19 V19 H1 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>'  
  ];
  const shapeColors = ['c-celeste', 'c-rosa', 'c-amarillo'];

  document.querySelectorAll('.body-text').forEach((p, index) => {
    
    // Condición para intercalar: Si el índice es impar (1, 3, 5), se salta y queda texto normal.
    if (index % 2 !== 0) {
      return; 
    }

    const originalText = p.textContent;
    p.innerHTML = '';
    const chars = originalText.split('');
    const spanArray = [];

    chars.forEach(char => {
      if (char.trim() === '') {
        p.appendChild(document.createTextNode(char));
      } else {
        const span = document.createElement('span');
        span.dataset.char = char;
        span.className = 'decode-char ' + shapeColors[Math.floor(Math.random() * shapeColors.length)];
        span.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        p.appendChild(span);
        spanArray.push(span);
      }
    });

    // Al scrollear, decodificamos el párrafo con un fade cruzado
    ScrollTrigger.create({
      trigger: p,
      start: "top 85%", 
      onEnter: () => {
        const shuffled = [...spanArray].sort(() => 0.5 - Math.random());
        const totalDuration = 2.8; 
        
        shuffled.forEach((span, i) => {
          const delay = (i / shuffled.length) * totalDuration;
          
          gsap.to(span, {
            opacity: 0,
            duration: 0.2,
            delay: delay,
            onComplete: () => {
              span.innerHTML = span.dataset.char;
              span.className = ''; 
              gsap.fromTo(span, {opacity: 0}, {opacity: 1, duration: 0.3});
            }
          });
        });
      },
      once: true
    });
  });

  // 4. HEADER DOTS — Navegación de 6 secciones
  const SECTIONS = [
    'section-hero',
    'section-fundamento',
    'section-conceptos',
    'section-galeria',
    'section-partitura',
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

  // 5. ANIMACIÓN DISPERSIÓN DE PIEZAS EN HERO (HOVER)
  const heroPiecesContainer = document.getElementById('hero-pieces');
  const pcs = document.querySelectorAll('.pc');

  heroPiecesContainer.addEventListener('mouseenter', () => {
    pcs.forEach(pc => {
      gsap.to(pc, {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        rotation: (Math.random() - 0.5) * 360,
        scale: 1 + Math.random() * 0.5,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  });

  heroPiecesContainer.addEventListener('mouseleave', () => {
    pcs.forEach(pc => {
      gsap.to(pc, {
        x: 0, y: 0, rotation: 0, scale: 1,
        duration: 1,
        ease: "back.out(1.5)"
      });
    });
  });

  // 6. CTA — Efecto magnético suave
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

  // 7. GALERÍA — Hover zoom sutil
  document.querySelectorAll('.gal-img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      const photo = img.querySelector('.gal-photo');
      if (photo) photo.style.transform = 'scale(1.05)';
    });
    img.addEventListener('mouseleave', () => {
      const photo = img.querySelector('.gal-photo');
      if (photo) photo.style.transform = '';
    });
  });

} // Fin initSiteAnimations