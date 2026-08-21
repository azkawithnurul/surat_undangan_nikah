/**
 * db.js
 * Lapisan database lokal menggunakan IndexedDB (native browser API,
 * tanpa dependency eksternal). Digunakan sebagai penyimpanan default
 * untuk ucapan/RSVP agar data tetap tersimpan meskipun halaman ditutup
 * atau browser di-restart — tidak seperti variabel JavaScript biasa
 * yang hilang setiap reload.
 *
 * Catatan penting: karena ini adalah website statis tanpa server,
 * database ini bersifat LOKAL PER PERANGKAT/BROWSER. Ucapan yang
 * dikirim oleh tamu A di HP-nya sendiri tidak otomatis muncul di
 * HP tamu B atau di perangkat mempelai. Untuk mengumpulkan seluruh
 * ucapan dari semua tamu ke satu tempat, gunakan salah satu dari:
 *   1) Tombol "Export Data" pada form RSVP (setiap tamu mengirim
 *      file JSON hasil ucapannya), atau
 *   2) Ganti `rsvpConfig.provider` ke backend nyata (Google Apps
 *      Script / Supabase / REST API) — lihat js/rsvp.js & README.md.
 */

const WEDDING_DB_NAME = "wedding_invitation_db";
const WEDDING_DB_VERSION = 1;
const WEDDING_STORE_NAME = "wishes";

let dbInstance = null;
let dbAvailable = "indexedDB" in window;

function openWeddingDB() {
  if (!dbAvailable) return Promise.reject(new Error("IndexedDB tidak tersedia"));
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WEDDING_DB_NAME, WEDDING_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(WEDDING_STORE_NAME)) {
        const store = db.createObjectStore(WEDDING_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("time", "time", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = () => reject(request.error);
  });
}

async function dbAddWish(entry) {
  try {
    const db = await openWeddingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(WEDDING_STORE_NAME, "readwrite");
      const store = tx.objectStore(WEDDING_STORE_NAME);
      const request = store.add(entry);
      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // Fallback ke localStorage bila IndexedDB gagal / diblokir (mis. mode private browsing)
    return dbAddWishFallback(entry);
  }
}

async function dbGetAllWishes() {
  try {
    const db = await openWeddingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(WEDDING_STORE_NAME, "readonly");
      const store = tx.objectStore(WEDDING_STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result || [];
        // Urutkan dari yang terbaru
        results.sort((a, b) => new Date(b.time) - new Date(a.time));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return dbGetAllWishesFallback();
  }
}

/* ---------- Fallback localStorage (jika IndexedDB tidak tersedia) ---------- */

const FALLBACK_KEY = "wedding_wishes_local_fallback";

function dbAddWishFallback(entry) {
  const wishes = dbGetAllWishesFallback();
  wishes.unshift({ ...entry, id: Date.now() });
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(wishes));
  return Promise.resolve({ success: true });
}

function dbGetAllWishesFallback() {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ---------- Export data (JSON) ---------- */

async function dbExportWishesAsFile() {
  const wishes = await dbGetAllWishes();
  const blob = new Blob([JSON.stringify(wishes, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wedding-wishes-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
