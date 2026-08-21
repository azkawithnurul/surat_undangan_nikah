/**
 * gallery.js
 * Merender galeri editorial serta lightbox tanpa dependency framework.
 */

let currentLightboxIndex = 0;

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const items = weddingConfig.gallery;
  grid.innerHTML = "";

  items.forEach((item, index) => {
    const figure = document.createElement("div");
    figure.className = `gallery__item gallery__item--${item.size}`;

    const btn = document.createElement("button");
    btn.className = "gallery__item-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", `Buka foto: ${item.alt}`);
    btn.addEventListener("click", () => openLightbox(index));

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    img.decoding = "async";

    btn.appendChild(img);
    figure.appendChild(btn);
    grid.appendChild(figure);
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const imgEl = document.getElementById("lightbox-img");
  const captionEl = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => stepLightbox(-1));
  nextBtn.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  function updateLightboxContent() {
    const item = weddingConfig.gallery[currentLightboxIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.alt;
  }

  window.__openLightboxContent = updateLightboxContent;
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  if (window.__openLightboxContent) window.__openLightboxContent();
  lightbox.classList.add("is-open");
  document.getElementById("lightbox-close").focus();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
}

function stepLightbox(direction) {
  const total = weddingConfig.gallery.length;
  currentLightboxIndex = (currentLightboxIndex + direction + total) % total;
  if (window.__openLightboxContent) window.__openLightboxContent();
}
