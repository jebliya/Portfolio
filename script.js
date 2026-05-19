/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

document.querySelectorAll('a,button,.exp-card,.cert-card,.info-card,.java-feat').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursor.style.background = 'rgba(168,85,247,.4)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = '#a855f7'; });
});

(function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateFollower);
})();

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== MOBILE MENU ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

/* ===== AOS (Animate On Scroll) ===== */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
aosEls.forEach(el => aosObs.observe(el));

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 40);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => counterObs.observe(c));

/* ===== TYPED CODE EFFECT ===== */
const javaCode = `public class RitaPortfolio {

    String name    = "Rita Rabia";
    String goal    = "Cybersécurité";
    String diploma = "BTS SIO SISR";

    public static void main(String[] args) {
        RitaPortfolio r = new RitaPortfolio();
        r.learn("Java");
        r.learn("Réseau");
        r.learn("Linux");
        r.build("Avenir");
    }

    void learn(String skill) {
        System.out.println(
            "✓ Maîtrise: " + skill
        );
    }

    void build(String dream) {
        System.out.println(
            "🚀 Direction: " + dream
        );
    }
}`;

const typedEl = document.getElementById('typed-code');
let typed = false;

function typeCode() {
  if (typed) return;
  typed = true;
  let i = 0;
  function next() {
    if (i < javaCode.length) {
      typedEl.textContent += javaCode[i];
      i++;
      setTimeout(next, i < 20 ? 30 : Math.random() * 20 + 10);
    }
  }
  next();
}

const codeObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { typeCode(); codeObs.disconnect(); }
}, { threshold: 0.3 });
const codeDemo = document.getElementById('code-demo');
if (codeDemo) codeObs.observe(codeDemo);

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-send');
  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('form-success').classList.remove('hidden');
    document.getElementById('contactForm').reset();
    btn.textContent = 'Envoyer le message';
    btn.disabled = false;
  }, 1200);
}

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObs.observe(s));

/* ===== EXPERIENCES TABS ===== */
const tabBtns = document.querySelectorAll('.exp-tab-btn');
const tabPanes = document.querySelectorAll('.exp-tab-pane');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Retirer 'active' de tous les boutons et panneaux
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));

    // Ajouter 'active' au bouton cliqué et au panneau correspondant
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    document.getElementById(targetId).classList.add('active');
  });
});

/* ===== GALLERY EXPERIENCES ===== */
function galleryGoto(galleryId, index) {
  const gallery = document.getElementById(galleryId);
  if (!gallery) return;
  const slides = gallery.querySelectorAll('.gallery-slide');
  const thumbs = gallery.querySelectorAll('.gallery-thumb');
  const curSpan = gallery.querySelector('.gallery-cur');
  
  slides.forEach(s => s.classList.remove('active'));
  thumbs.forEach(t => t.classList.remove('active'));
  
  if (slides[index]) slides[index].classList.add('active');
  if (thumbs[index]) thumbs[index].classList.add('active');
  if (curSpan) curSpan.textContent = index + 1;
}

function galleryNav(galleryId, dir) {
  const gallery = document.getElementById(galleryId);
  if (!gallery) return;
  const slides = gallery.querySelectorAll('.gallery-slide');
  let currentIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
  if (currentIndex === -1) currentIndex = 0;
  
  let newIndex = currentIndex + dir;
  if (newIndex < 0) newIndex = slides.length - 1;
  if (newIndex >= slides.length) newIndex = 0;
  
  galleryGoto(galleryId, newIndex);
}


