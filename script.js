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

  // 2. EFECTO TYPEWRITER (VERBOS STICKY)
  const verbLines = document.querySelectorAll('.verb-line');
  verbLines.forEach((verb, i) => {
    const textToType = verb.getAttribute('data-text');
    ScrollTrigger.create({
      trigger: ".fundamento-layout",
      start: "top 60%",
      onEnter: () => {
        gsap.to(verb, {
          duration: 1,
          text: textToType,
          ease: "power1.inOut",
          delay: i * 0.4 
        });
      }
    });
  });

  // 3. EFECTO DECODIFICACIÓN INTERCALADO 
  const shapes = [
    '<svg class="g-shp" viewBox="0 0 30 20"><path d="M1,1 H29 V9 H19 V19 H9 V9 H1 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 30 10"><rect x="1" y="1" width="28" height="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 20 30"><path d="M1,1 H9 V19 H19 V29 H1 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 20 10"><rect x="1" y="1" width="18" height="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>', 
    '<svg class="g-shp" viewBox="0 0 20 20"><path d="M1,1 H9 V9 H19 V19 H1 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>'  
  ];
  const shapeColors = ['c-celeste', 'c-rosa', 'c-amarillo'];

  document.querySelectorAll('.body-text').forEach((p, index) => {
    
    // Condición para intercalar
    if (index % 2 !== 0) return; 

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

  // 4. HEADER DOTS 
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

  // 5. NUEVO: ANIMACIÓN DE PIEZAS HERO (CAOS -> ORDEN AL PASAR EL MOUSE)
  const heroPiecesContainer = document.getElementById('hero-pieces-wrapper');
  const pcs = document.querySelectorAll('.hero-pieces-wrapper .pc');

  // Posiciones de la grilla ordenada 2x3 (46px por pieza con gap)
  const gridSize = 50; 
  const gridPositions = [
    {x: 0, y: 0}, {x: gridSize, y: 0}, {x: gridSize*2, y: 0},
    {x: 0, y: gridSize}, {x: gridSize, y: gridSize}, {x: gridSize*2, y: gridSize}
  ];

  // Función para obtener una posición dispersa al azar
  function getScatteredPos() {
    return {
      x: (Math.random() - 0.5) * 250,
      y: (Math.random() - 0.5) * 250,
      rotation: (Math.random() - 0.5) * 360
    };
  }

  // Iniciamos la dispersión y flotación constante
  pcs.forEach((pc) => {
    const start = getScatteredPos();
    gsap.set(pc, { x: start.x, y: start.y, rotation: start.rotation });
    
    // Flotación constante (yoyo infinito)
    gsap.to(pc, {
      x: start.x + (Math.random() - 0.5) * 60,
      y: start.y + (Math.random() - 0.5) * 60,
      rotation: start.rotation + (Math.random() - 0.5) * 45,
      duration: 3 + Math.random() * 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      overwrite: "auto"
    });
  });

  // Al pasar el cursor: SE ARMAN
  heroPiecesContainer.addEventListener('mouseenter', () => {
    pcs.forEach((pc, i) => {
      gsap.to(pc, {
        x: gridPositions[i].x,
        y: gridPositions[i].y,
        rotation: 0,
        scale: 1.1, // Se hacen apenas más grandes al armarse
        duration: 0.8,
        ease: "back.out(1.5)",
        overwrite: "auto"
      });
    });
  });

  // Al quitar el cursor: VUELVEN AL CAOS
  heroPiecesContainer.addEventListener('mouseleave', () => {
    pcs.forEach((pc) => {
      const start = getScatteredPos();
      gsap.to(pc, {
        x: start.x,
        y: start.y,
        rotation: start.rotation,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          // Retoman la flotación natural después de explotar
          gsap.to(pc, {
            x: start.x + (Math.random() - 0.5) * 60,
            y: start.y + (Math.random() - 0.5) * 60,
            rotation: start.rotation + (Math.random() - 0.5) * 45,
            duration: 3 + Math.random() * 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            overwrite: "auto"
          });
        }
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