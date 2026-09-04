(() => {
  'use strict';

  const SOURCES = [
    'executive-siesta-01.jpg',
    'executive-siesta-02.jpg',
    'executive-siesta-03.jpg',
    'executive-siesta-04.jpg'
  ];
  const HOLD_MS = 10000;
  const FADE_MS = 1400;
  const CACHE_TAG = '20260903-rebuild-1';

  const gallery = document.getElementById('gallery');
  const status = document.getElementById('galleryStatus');
  const layers = [document.getElementById('layerA'), document.getElementById('layerB')];
  if (!gallery || layers.some(layer => !layer)) return;

  let front = 0;
  let currentSource = SOURCES[0];
  let deck = [];
  let timer = null;
  let transitioning = false;
  let touchStartX = null;

  function urlFor(source) {
    return `${source}?v=${CACHE_TAG}`;
  }

  function shuffle(items) {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function refillDeck() {
    deck = shuffle(SOURCES.filter(src => src !== currentSource));
  }

  function nextSource(direction = 1) {
    if (direction < 0) {
      const choices = SOURCES.filter(src => src !== currentSource);
      return choices[Math.floor(Math.random() * choices.length)];
    }
    if (!deck.length) refillDeck();
    return deck.shift();
  }

  function preload(source) {
    return new Promise(resolve => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = async () => {
        try { if (img.decode) await img.decode(); } catch (_) {}
        resolve(true);
      };
      img.onerror = () => resolve(false);
      img.src = urlFor(source);
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => show(nextSource(1)), HOLD_MS);
  }

  async function show(source) {
    if (transitioning || !source || source === currentSource) {
      schedule();
      return;
    }

    transitioning = true;
    clearTimeout(timer);

    const ready = await preload(source);
    if (!ready) {
      transitioning = false;
      schedule();
      return;
    }

    const oldLayer = layers[front];
    const newIndex = front === 0 ? 1 : 0;
    const newLayer = layers[newIndex];

    newLayer.className = 'gallery-image incoming';
    newLayer.src = urlFor(source);
    try { if (newLayer.decode) await newLayer.decode(); } catch (_) {}

    requestAnimationFrame(() => {
      requestAnimationFrame(() => newLayer.classList.add('reveal'));
    });

    await new Promise(resolve => setTimeout(resolve, FADE_MS + 80));

    oldLayer.className = 'gallery-image';
    newLayer.className = 'gallery-image active';
    oldLayer.removeAttribute('src');

    front = newIndex;
    currentSource = source;
    transitioning = false;
    if (status) status.textContent = `Showing ${source}`;

    const upcoming = deck.length ? deck[0] : SOURCES.find(src => src !== currentSource);
    if (upcoming) preload(upcoming);
    schedule();
  }

  layers[0].src = urlFor(currentSource);
  layers[0].className = 'gallery-image active';
  Promise.all(SOURCES.map(preload)).then(() => {
    refillDeck();
    schedule();
  });

  gallery.addEventListener('touchstart', event => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  gallery.addEventListener('touchend', event => {
    if (touchStartX === null || transitioning) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 45) return;
    show(nextSource(dx > 0 ? -1 : 1));
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else if (!transitioning) schedule();
  });
})();
