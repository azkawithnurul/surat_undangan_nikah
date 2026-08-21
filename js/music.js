/**
 * music.js
 * Background music player. Musik dicoba diputar otomatis segera setelah
 * halaman dimuat. Browser modern (Chrome, Safari, dll) sering tetap
 * memblokir autoplay dengan suara sebelum ada interaksi pengguna sama
 * sekali di halaman tersebut — bila itu terjadi, script ini otomatis
 * mencoba lagi pada interaksi pertama (klik/tap/scroll/keyboard di mana
 * pun, termasuk tombol "Open Invitation") sehingga musik tetap terasa
 * "otomatis" bagi pengguna tanpa perlu tombol play manual.
 */

let audioEl = null;
let autoplayFallbackBound = false;

function initMusicPlayer() {
  if (!weddingConfig.music.enabled || !weddingConfig.music.source) return;

  audioEl = document.getElementById("bg-audio");
  const toggleBtn = document.getElementById("music-toggle");
  if (!audioEl || !toggleBtn) return;

  audioEl.src = weddingConfig.music.source;
  audioEl.loop = true;
  audioEl.autoplay = true;
  audioEl.playsInline = true;

  toggleBtn.classList.add("is-visible");
  toggleBtn.addEventListener("click", () => {
    if (audioEl.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Coba putar otomatis segera saat halaman dimuat.
  attemptAutoplay();
}

function attemptAutoplay() {
  if (!audioEl) return;
  const playPromise = audioEl.play();

  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        onMusicStarted();
      })
      .catch(() => {
        // Autoplay ditolak browser: pasang fallback pada interaksi pertama.
        bindAutoplayFallback();
      });
  }
}

function bindAutoplayFallback() {
  if (autoplayFallbackBound) return;
  autoplayFallbackBound = true;

  const tryPlayOnce = () => {
    playMusic();
    document.removeEventListener("click", tryPlayOnce);
    document.removeEventListener("touchstart", tryPlayOnce);
    document.removeEventListener("keydown", tryPlayOnce);
    document.removeEventListener("scroll", tryPlayOnce);
  };

  document.addEventListener("click", tryPlayOnce, { once: true });
  document.addEventListener("touchstart", tryPlayOnce, { once: true, passive: true });
  document.addEventListener("keydown", tryPlayOnce, { once: true });
  document.addEventListener("scroll", tryPlayOnce, { once: true, passive: true });
}

function onMusicStarted() {
  const toggleBtn = document.getElementById("music-toggle");
  if (toggleBtn) {
    toggleBtn.classList.add("is-playing");
    toggleBtn.setAttribute("aria-label", "Jeda musik latar");
  }
}

function playMusic() {
  if (!audioEl) return;
  audioEl
    .play()
    .then(onMusicStarted)
    .catch(() => {
      /* Diabaikan: browser tetap menolak; pengguna masih bisa memutar manual lewat tombol. */
    });
}

function pauseMusic() {
  if (!audioEl) return;
  audioEl.pause();
  const toggleBtn = document.getElementById("music-toggle");
  if (toggleBtn) {
    toggleBtn.classList.remove("is-playing");
    toggleBtn.setAttribute("aria-label", "Putar musik latar");
  }
}

function startMusicAfterOpen() {
  const toggleBtn = document.getElementById("music-toggle");
  if (toggleBtn) toggleBtn.classList.add("is-visible");
  playMusic();
}