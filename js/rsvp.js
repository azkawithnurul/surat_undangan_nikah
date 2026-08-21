/**
 * rsvp.js
 * Form RSVP + guestbook ucapan.
 * Struktur adapter memungkinkan backend diganti (Google Apps Script,
 * Supabase, REST API) hanya dengan mengubah `rsvpConfig.provider`
 * tanpa mengubah UI.
 *
 * Provider "local" (default) menyimpan data ke database lokal browser
 * (IndexedDB, lihat js/db.js) sehingga ucapan tetap tersimpan walau
 * halaman ditutup atau browser di-restart.
 */

const WISHES_PAGE_SIZE = 5;
let visibleWishCount = WISHES_PAGE_SIZE;

/* ---------- Adapter layer ---------- */

const rsvpAdapters = {
  local: {
    async submit(entry) {
      return dbAddWish(entry);
    },
    async list() {
      return dbGetAllWishes();
    }
  },

  rest: {
    async submit(entry) {
      const res = await fetch(weddingConfig.rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });
      if (!res.ok) throw new Error("Gagal mengirim RSVP");
      return res.json();
    },
    async list() {
      const res = await fetch(weddingConfig.rsvp.endpoint);
      if (!res.ok) throw new Error("Gagal memuat ucapan");
      return res.json();
    }
  },

  "google-script": {
    async submit(entry) {
      const res = await fetch(weddingConfig.rsvp.endpoint, {
        method: "POST",
        body: JSON.stringify(entry)
      });
      return res.json();
    },
    async list() {
      const res = await fetch(weddingConfig.rsvp.endpoint);
      return res.json();
    }
  },

  supabase: {
    async submit(entry) {
      const res = await fetch(weddingConfig.rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });
      return res.json();
    },
    async list() {
      const res = await fetch(weddingConfig.rsvp.endpoint);
      return res.json();
    }
  }
};

function getActiveAdapter() {
  return rsvpAdapters[weddingConfig.rsvp.provider] || rsvpAdapters.local;
}

/* ---------- Form ---------- */

function initRSVP() {
  const form = document.getElementById("rsvp-form");
  const statusEl = document.getElementById("rsvp-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const entry = {
      name: String(formData.get("name") || "").trim(),
      attendance: String(formData.get("attendance") || ""),
      guests: Number(formData.get("guests") || 1),
      message: String(formData.get("message") || "").trim(),
      time: new Date().toISOString()
    };

    if (!entry.name || !entry.message) {
      statusEl.textContent = "Mohon lengkapi nama dan ucapan terlebih dahulu.";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    statusEl.textContent = "Mengirim ucapan...";

    try {
      await getActiveAdapter().submit(entry);
      statusEl.textContent = "Terima kasih! Ucapan dan doa Anda telah terkirim.";
      form.reset();
      visibleWishCount = WISHES_PAGE_SIZE;
      await renderWishes();
    } catch (err) {
      statusEl.textContent = "Maaf, terjadi kendala saat mengirim. Silakan coba lagi.";
    } finally {
      submitBtn.disabled = false;
    }
  });

  const moreBtn = document.getElementById("wishes-more");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      visibleWishCount += WISHES_PAGE_SIZE;
      renderWishes();
    });
  }

  const exportBtn = document.getElementById("wishes-export");
  if (exportBtn) {
    // Tombol export hanya relevan bila data disimpan di database lokal
    // (provider "local"), karena backend eksternal biasanya sudah punya
    // dashboard/admin sendiri untuk melihat seluruh data.
    if (weddingConfig.rsvp.provider === "local") {
      exportBtn.classList.remove("hidden");
      exportBtn.addEventListener("click", async () => {
        await dbExportWishesAsFile();
        showToast("File ucapan berhasil diunduh!");
      });
    } else {
      exportBtn.classList.add("hidden");
    }
  }

  renderWishes();
}

function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay} hari lalu`;
}

const attendanceLabel = {
  hadir: "Akan Hadir",
  "tidak-hadir": "Tidak Dapat Hadir",
  ragu: "Masih Ragu"
};

async function renderWishes() {
  const listEl = document.getElementById("wishes-list");
  const emptyEl = document.getElementById("wishes-empty");
  const moreBtn = document.getElementById("wishes-more");
  if (!listEl) return;

  let wishes = [];
  try {
    wishes = await getActiveAdapter().list();
  } catch {
    wishes = [];
  }

  if (wishes.length === 0) {
    listEl.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("hidden");
    if (moreBtn) moreBtn.classList.add("hidden");
    return;
  }

  if (emptyEl) emptyEl.classList.add("hidden");

  const visible = wishes.slice(0, visibleWishCount);
  listEl.innerHTML = "";

  visible.forEach((wish) => {
    const card = document.createElement("li");
    card.className = "wish-card";

    const nameSafe = document.createElement("span");
    nameSafe.className = "wish-card__name";
    nameSafe.textContent = wish.name;

    const timeSafe = document.createElement("span");
    timeSafe.className = "wish-card__time";
    timeSafe.textContent = formatRelativeTime(wish.time);

    const head = document.createElement("div");
    head.className = "wish-card__head";
    head.appendChild(nameSafe);
    head.appendChild(timeSafe);

    const attendance = document.createElement("span");
    attendance.className = "wish-card__attendance";
    attendance.textContent = attendanceLabel[wish.attendance] || "";

    const text = document.createElement("p");
    text.className = "wish-card__text";
    text.textContent = wish.message;

    card.appendChild(head);
    card.appendChild(attendance);
    card.appendChild(text);
    listEl.appendChild(card);
  });

  if (moreBtn) {
    moreBtn.classList.toggle("hidden", visibleWishCount >= wishes.length);
  }
}