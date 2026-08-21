/**
 * app.js
 * Orchestrator utama: membaca konfigurasi, merender seluruh section,
 * dan menginisialisasi interaksi setelah DOM siap.
 */

/* ---------- Guest name (URL personalization) ---------- */

/**
 * Mengambil nama tamu dari URL. Mendukung 3 format sekaligus supaya
 * fleksibel dipakai di GitHub Pages ataupun hosting statis lainnya:
 *
 *   1) Query string (disarankan): ?to=Nama+Tamu
 *      contoh: https://username.github.io/wedding-invitation/?to=Budi+Santoso
 *
 *   2) Hash: #to=Nama+Tamu
 *      contoh: https://username.github.io/wedding-invitation/#to=Budi+Santoso
 *
 *   3) Segmen path: /to=Nama+Tamu atau /to/Nama+Tamu
 *      contoh: https://username.github.io/wedding-invitation/to=Budi+Santoso
 *      (berguna bila ingin link tanpa tanda "?", namun perlu redirect
 *      404 -> index.html pada GitHub Pages agar path tersebut tetap
 *      memuat index.html; lihat README untuk detail konfigurasinya)
 */
function getGuestName() {
  // 1) Query string: ?to=...
  const queryParams = new URLSearchParams(window.location.search);
  let raw = queryParams.get("to");

  // 2) Hash: #to=...
  if (!raw && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    raw = hashParams.get("to");
  }

  // 3) Path: /to=Nama atau /to/Nama (segmen terakhir pada path)
  if (!raw) {
    const path = decodeURIComponent(window.location.pathname);
    const pathMatch = path.match(/\/to[=/]([^/]+)\/?$/i);
    if (pathMatch && pathMatch[1]) {
      raw = pathMatch[1].replace(/\+/g, " ");
    }
  }

  if (!raw) return null;
  // decodeURIComponent aman digunakan di sini karena URLSearchParams
  // sudah melakukan decoding; hasilnya tetap akan dimasukkan via textContent,
  // bukan innerHTML, sehingga tidak berisiko XSS.
  return raw.trim() || null;
}

function renderGuestName() {
  const guestName = getGuestName();
  const coverGuestEl = document.getElementById("cover-guest-name");
  if (coverGuestEl) {
    // textContent digunakan agar input dari URL tidak pernah dirender sebagai HTML.
    coverGuestEl.textContent = guestName || "Our Beloved Guest";
  }

  const pageTitleGuest = document.getElementById("page-title-guest");
  if (pageTitleGuest && guestName) {
    pageTitleGuest.textContent = `Dear ${guestName}`;
  }
}

/* ---------- Couple ---------- */

function renderCouple() {
  const { groom, bride } = weddingConfig.couple;

  setText("hero-groom-name", groom.nickname);
  setText("hero-bride-name", bride.nickname);
  setText("cover-groom-name", groom.nickname);
  setText("cover-bride-name", bride.nickname);
  setText("closing-groom-name", groom.nickname);
  setText("closing-bride-name", bride.nickname);

  setText("groom-full-name", groom.name);
  setText("groom-parents", groom.parents);
  setText("bride-full-name", bride.name);
  setText("bride-parents", bride.parents);

  setImage("groom-photo", groom.photo, `Potret ${groom.name}`);
  setImage("bride-photo", bride.photo, `Potret ${bride.name}`);
  setImage("hero-photo", weddingConfig.hero.photo, `${groom.name} & ${bride.name}`);
  setImage("cover-photo", weddingConfig.hero.coverPhoto, `${groom.name} & ${bride.name}`);
  setImage("closing-photo", weddingConfig.hero.photo, `${groom.name} & ${bride.name}`);

  setText("hero-date", weddingConfig.wedding.displayDate);
  setText("cover-date", weddingConfig.wedding.displayDate);

  document.title = weddingConfig.seo.title;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

function setImage(id, src, alt) {
  const el = document.getElementById(id);
  if (el && src) {
    el.src = src;
    el.alt = alt || "";
  }
}

/* ---------- Quote ---------- */

function renderQuote() {
  setText("quote-text", `"${weddingConfig.quote.text}"`);
  setText("quote-source", weddingConfig.quote.source);
}

/* ---------- Love story timeline ---------- */

function renderLoveStory() {
  const container = document.getElementById("timeline-list");
  if (!container) return;
  container.innerHTML = "";

  weddingConfig.loveStory.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline__item reveal";

    li.innerHTML = `
      <span class="timeline__dot" aria-hidden="true"></span>
      <span class="timeline__year">${escapeHtml(item.year)}</span>
      <h3 class="timeline__title">${escapeHtml(item.title)}</h3>
      <p class="timeline__desc">${escapeHtml(item.desc)}</p>
    `;
    container.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Events ---------- */

function renderEvents() {
  const { akad, reception } = weddingConfig.wedding;

  setText("akad-title", akad.label);
  setText("akad-time", `${weddingConfig.wedding.displayDate} · ${akad.time}`);
  setText("akad-venue", akad.venue);
  setText("akad-address", akad.address);

  setText("reception-title", reception.label);
  setText("reception-time", `${weddingConfig.wedding.displayDate} · ${reception.time}`);
  setText("reception-venue", reception.venue);
  setText("reception-address", reception.address);

  const akadMapsBtn = document.getElementById("akad-maps-btn");
  if (akadMapsBtn) {
    akadMapsBtn.href = `https://maps.google.com/?q=${encodeURIComponent(akad.venue + " " + akad.address)}`;
  }
  const receptionMapsBtn = document.getElementById("reception-maps-btn");
  if (receptionMapsBtn) {
    receptionMapsBtn.href = weddingConfig.location.mapsUrl;
  }
}

/* ---------- Video ---------- */

function renderVideo() {
  const section = document.getElementById("video-section");
  if (!section) return;

  if (!weddingConfig.video.enabled || !weddingConfig.video.url) {
    section.classList.add("hidden");
    return;
  }

  const frame = document.getElementById("video-frame");
  if (frame) frame.src = weddingConfig.video.url;
  section.classList.remove("hidden");
}

/* ---------- Location ---------- */

function renderLocation() {
  setText("location-venue", weddingConfig.location.venueName);
  setText("location-address", weddingConfig.location.address);

  const mapFrame = document.getElementById("location-map-frame");
  if (mapFrame) mapFrame.src = weddingConfig.location.mapsEmbedUrl;

  const mapsBtn = document.getElementById("location-maps-btn");
  if (mapsBtn) mapsBtn.href = weddingConfig.location.mapsUrl;
}

/* ---------- Gift ---------- */

function renderGift() {
  const section = document.getElementById("gift-section");
  if (!section) return;

  if (!weddingConfig.gift.enabled) {
    section.classList.add("hidden");
    return;
  }

  const container = document.getElementById("gift-bank-list");
  if (container) {
    container.innerHTML = "";
    weddingConfig.gift.banks.forEach((bank) => {
      container.appendChild(buildGiftCard(bank.bank, bank.accountNumber, bank.accountName));
    });
    weddingConfig.gift.ewallets.forEach((ew) => {
      container.appendChild(buildGiftCard(ew.name, ew.accountNumber, ew.accountName));
    });
  }

  const addressBlock = document.getElementById("gift-address");
  if (addressBlock) {
    if (weddingConfig.gift.address.enabled) {
      addressBlock.classList.remove("hidden");
      setText("gift-address-recipient", weddingConfig.gift.address.recipient);
      setText("gift-address-text", weddingConfig.gift.address.address);
    } else {
      addressBlock.classList.add("hidden");
    }
  }
}

function buildGiftCard(label, number, name) {
  const card = document.createElement("div");
  card.className = "gift-card";
  card.innerHTML = `
    <div>
      <span class="gift-card__bank">${escapeHtml(label)}</span>
      <p class="gift-card__number">${escapeHtml(number)}</p>
      <span class="gift-card__name">a.n. ${escapeHtml(name)}</span>
    </div>
    <button type="button" class="gift-card__copy" aria-label="Salin nomor rekening ${escapeHtml(label)}" data-copy="${escapeHtml(number)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M4 16V5.5A1.5 1.5 0 0 1 5.5 4H16"/></svg>
    </button>
  `;

  const copyBtn = card.querySelector(".gift-card__copy");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(number)
      .then(() => showToast("Nomor rekening disalin!"))
      .catch(() => showToast("Gagal menyalin, coba salin manual."));
  });

  return card;
}

/* ---------- Toast ---------- */

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

/* ---------- Scroll reveal animations ---------- */

function initScrollAnimations() {
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- Cover / Open Invitation ---------- */

function initCover() {
  const openBtn = document.getElementById("open-invitation-btn");
  const cover = document.getElementById("cover");
  if (!openBtn || !cover) return;

  openBtn.addEventListener("click", () => {
    cover.classList.add("is-closed");
    document.body.style.overflow = "";
    startMusicAfterOpen();
    if (window.__showNav) window.__showNav();

    // Pindahkan fokus ke konten utama untuk aksesibilitas
    const main = document.getElementById("main-content");
    if (main) main.setAttribute("tabindex", "-1"), main.focus({ preventScroll: true });
  });

  document.body.style.overflow = "hidden";
}

/* ---------- SEO meta (dinamis dari config) ---------- */

function applySEO() {
  const { seo } = weddingConfig;
  document.title = seo.title;

  setMeta('meta[name="description"]', seo.description);
  setMeta('meta[property="og:title"]', seo.title);
  setMeta('meta[property="og:description"]', seo.description);
  setMeta('meta[property="og:image"]', seo.ogImage);
  setMeta('meta[name="twitter:title"]', seo.title);
  setMeta('meta[name="twitter:description"]', seo.description);
  setMeta('meta[name="theme-color"]', seo.themeColor);
}

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el && content) el.setAttribute("content", content);
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  applySEO();
  renderGuestName();
  renderCouple();
  renderQuote();
  renderLoveStory();
  renderEvents();
  renderVideo();
  renderGallery();
  renderLocation();
  renderGift();
  renderCountdown();

  initCover();
  initLightbox();
  initMusicPlayer();
  initNavigation();
  initRSVP();
  initSaveTheDate();
  initScrollAnimations();
});