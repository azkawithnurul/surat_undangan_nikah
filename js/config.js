/**
 * config.js
 * Satu-satunya sumber data untuk seluruh website undangan.
 * Ganti nilai-nilai di bawah ini untuk mempersonalisasi undangan
 * tanpa perlu menyentuh HTML, CSS, atau logika JavaScript lainnya.
 */

const weddingConfig = {
  couple: {
    groom: {
      name: "Maulidul Azka, S.Pd",
      nickname: "Azka",
      parents: "Anak Kelima Bapak Muhram dan Ibu Sarinah",
      photo: "assets/images/groom.jpg",
      instagram: ""
    },
    bride: {
      name: "Nurul Rahmawati, S.Pd",
      nickname: "Nurul",
      parents: "Anak Pertama Bapak Suanto dan Ibu Erni",
      photo: "assets/images/bride.jpg",
      instagram: ""
    }
  },

  hero: {
    heading: "The Wedding Of",
    photo: "assets/images/hero.jpg",
    coverPhoto: "assets/images/cover.jpg"
  },

  wedding: {
    // Format ISO agar mudah dibaca oleh JavaScript (countdown & kalender)
    date: "2026-08-23",
    displayDate: "Minggu, 23 Agustus 2026",
    akad: {
      label: "Acara Adat",
      time: "08.00 - 12.00 WIB",
      startISO: "2026-08-23T08:00:00+07:00",
      endISO: "2026-08-23T12:00:00+07:00",
      venue: "Kediaman Bapak Muhram",
      address: "Gg. Gusti Muhammad Ali, Depan Kantor PU (Samping SMP 2 Ngabang)"
    },
    reception: {
      label: "Yasinan",
      time: "12.00 - 20.00 WIB",
      startISO: "2026-08-23T13:00:00+07:00",
      endISO: "2026-08-23T20:00:00+07:00",
      venue: "Kediaman Bapak Muhram",
      address: "Gg. Gusti Muhammad Ali, Depan Kantor PU (Samping SMP 2 Ngabang)"
    }
  },

  quote: {
    text:
      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum: 21"
  },

  loveStory: [
    { year: "2019", title: "First Meet", desc: "Kami bertemu di bangku kuliah ketika kami masih menjadi mahasiswa baru di kampus yang sama. Diantara miliaran kemungkinan semesta memilih untuk mempertemukan kami dalam satu waktu yang tak terduga dan memulai cerita yang sudah Allah SWT gariskan. 🫶🏻" },
    { year: "2025", title: "Growing Together", desc: "Perjalanan kami selama 2.301 hari bukan hanya tentang kebahagiaan, tetapi saling proses mendewasakan. Kami belajar menyatukan perbedaan, membangun fondasi, dan meyakini bahwa setiap tantangan adalah cara kami untuk bertahan bersama. 🫶🏻" },
    { year: "March 2025", title: "Propose", desc: "Dititik ini, kami memilih untuk berhenti mencari. Momen lamaran pada bulan Maret 2025 menjadi bukti nyata dari kesungguhan hati. Sebuah pernyataan bahwa kami siap melangkah lebih jauh. Kami memilih untuk saling memaafkan, menjaga, mulai dari detik ini hingga selamanya . Insya Allah🫶🏻" },
    { year: "2026", title: "The Wedding", desc: "Hari ini 28 Juni 2026 dua doa menyatu menjadi satu tujuan. Di hadapan Sang Pencipta, kami mengukir janji suci untuk memulai hidup baru. Pernikahan ini bukanlah akhir, melainkan gerbang menuju petualangan abadi yang akan kami tempuh bersama. Aamiiin🫶🏻" }
  ],

  gallery: [
    { src: "assets/images/gallery-1.jpg", size: "large", alt: "Foto prewedding Aditya dan Alia di taman" },
    { src: "assets/images/gallery-2.jpg", size: "large", alt: "Potret Alia mengenakan gaun pengantin" },
    { src: "assets/images/gallery-3.jpg", size: "large", alt: "Momen candid Aditya dan Alia tertawa" },
    { src: "assets/images/gallery-4.jpg", size: "large", alt: "Aditya dan Alia berpegangan tangan" },
    { src: "assets/images/gallery-5.jpg", size: "large", alt: "Foto prewedding di pantai saat matahari terbenam" },
    { src: "assets/images/gallery-6.jpg", size: "large", alt: "Potret close-up pasangan" }
  ],

  video: {
    enabled: false,
    url: "https://www.youtube.com/watch?v=C-o8pTi6vd8&list=RDC-o8pTi6vd8&start_radio=1"
  },

  music: {
    enabled: true,
    source: "assets/music/wedding-song.mp3",
    title: "A Thousand Years - Piano Cover"
  },

  location: {
    venueName: "Kediaman Bapak Muhram",
    address: "Gg. Gusti Muhammad Ali, Depan Kantor PU (Samping SMP 2 Ngabang)",
    mapsUrl:
      "https://www.google.com/maps?q=0.3963516056537628,109.9472885131836&z=17&hl=en",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=0.3963516056537628,109.9472885131836&z=17&hl=en&ie=UTF8&iwloc=&output=embed"
  },

  gift: {
    enabled: true,
    banks: [
      { bank: "BCA", accountNumber: "1234567890", accountName: "Aditya Pratama" },
      { bank: "Mandiri", accountNumber: "0987654321", accountName: "Alia Maharani" }
    ],
    ewallets: [
      { name: "GoPay", accountNumber: "0812-3456-7890", accountName: "Maulidul Azka, S.Pd" }
    ],
    address: {
      enabled: true,
      recipient: "Maulidul Azka & Nurul Rahmawati",
      address: "Gg. Gusti Muhammad Ali, Depan Kantor PU (Samping SMP 2 Ngabang), Ngabang, Landak, Kalimantan Barat",
    }
  },

  rsvp: {
    provider: "local", // ganti ke "google-script" | "supabase" | "rest" bila backend tersedia
    endpoint: ""
  },

  seo: {
    title: "The Wedding of Azka & Nurul",
    description:
      "Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir merayakan pernikahan Azka & Nurul.",
    ogImage: "assets/images/cover.jpg",
    themeColor: "#C79A3D"
  }
};