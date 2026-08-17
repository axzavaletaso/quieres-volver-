// Fecha en la cabecera de la carta
const dateline = document.getElementById('dateline');
const hoy = new Date().toLocaleDateString('es-PE', { day:'numeric', month:'long', year:'numeric' });
dateline.textContent = `Trujillo, ${hoy}`;

// Partículas ambientales (motas de luz cálida)
const particlesWrap = document.getElementById('particles');
const total = 16;
for (let i = 0; i < total; i++) {
  const p = document.createElement('span');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (7 + Math.random() * 6) + 's';
  p.style.animationDelay = (Math.random() * 8) + 's';
  p.style.width = p.style.height = (2 + Math.random() * 2) + 'px';
  particlesWrap.appendChild(p);
}

// Abrir el sobre
const envelopeBtn = document.getElementById('envelopeBtn');
const envelopeScene = document.getElementById('envelopeScene');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

envelopeBtn.addEventListener('click', () => {
  if (envelopeBtn.classList.contains('opening')) return;
  envelopeBtn.classList.add('opening');
  envelopeBtn.setAttribute('aria-label', 'Carta abierta');
  const wait = reduced ? 50 : 1300;
  setTimeout(() => {
    envelopeScene.classList.add('fade-out');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    setTimeout(() => { envelopeScene.style.display = 'none'; }, reduced ? 0 : 700);
  }, wait);
});

// Revelado progresivo de párrafos al hacer scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.25 });
revealEls.forEach(el => observer.observe(el));

// Respuesta al final de la carta
const replyButtons = document.querySelectorAll('.reply-actions .btn');
const replyResponse = document.getElementById('replyResponse');
const resetReply = document.getElementById('resetReply');
const responses = {
  yes: 'Gracias por darme esta oportunidad. No la voy a desperdiciar. 💛',
  wait: 'Está bien, tómate el tiempo que necesites. Aquí voy a estar.'
};

const FORMSPREE_URL = 'https://formspree.io/f/xbgrzoyq';

function enviarRespuesta(etiqueta) {
  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      respuesta: etiqueta,
      fecha: new Date().toLocaleString('es-PE')
    })
  }).catch(err => console.error('No se pudo enviar la respuesta:', err));
}

replyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    replyButtons.forEach(b => b.disabled = true);
    replyResponse.textContent = responses[btn.dataset.reply];
    replyResponse.classList.add('show');
    resetReply.hidden = false;
    enviarRespuesta(btn.textContent.trim());
  });
});

resetReply.addEventListener('click', () => {
  replyButtons.forEach(b => b.disabled = false);
  replyResponse.classList.remove('show');
  replyResponse.textContent = '';
  resetReply.hidden = true;
});
