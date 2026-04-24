(function () {
  const root = document.documentElement;

  function enforceBrand() {
    root.dataset.theme = 'synth';
    root.dataset.bg = 'topo';
    root.dataset.defaultTheme = 'synth';
    root.dataset.defaultBg = 'topo';
  }

  function assignMotionIndexes() {
    document.querySelectorAll('.reveal').forEach((el, index) => {
      el.style.setProperty('--reveal-index', String(Math.min(index, 12)));
    });
  }

  function bindMenu() {
    const menu = document.getElementById('menuBtn');
    const nav = document.getElementById('nav');
    if (!menu || !nav) return;

    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      menu.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  function bindMotion() {
    const tiltSelector = '.card, .arsenal-cell, .pipe-step, .team-card, .proof-card, .product-link';

    document.addEventListener('pointermove', event => {
      const target = event.target.closest(tiltSelector);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 5;
      const rotateX = (0.5 - py) * 5;

      target.style.setProperty('--tilt-x', rotateX.toFixed(2) + 'deg');
      target.style.setProperty('--tilt-y', rotateY.toFixed(2) + 'deg');
      target.style.setProperty('--glow-x', (px * 100).toFixed(1) + '%');
      target.style.setProperty('--glow-y', (py * 100).toFixed(1) + '%');
    });

    document.addEventListener('pointerout', event => {
      const target = event.target.closest(tiltSelector);
      if (!target || (event.relatedTarget && target.contains(event.relatedTarget))) return;

      target.style.removeProperty('--tilt-x');
      target.style.removeProperty('--tilt-y');
      target.style.removeProperty('--glow-x');
      target.style.removeProperty('--glow-y');
    });
  }

  function bind() {
    enforceBrand();
    assignMotionIndexes();
    bindMenu();
    bindMotion();
    document.body.classList.add('page-ready');
  }

  window.PhantomExplorer = {
    theme: 'synth',
    background: 'topo',
    enforceBrand,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
