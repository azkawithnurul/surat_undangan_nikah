/**
 * countdown.js
 * Native realtime countdown menuju tanggal pernikahan.
 */

let countdownInterval = null;

function renderCountdown() {
  const container = document.getElementById("countdown-grid");
  const arrivedEl = document.getElementById("countdown-arrived");
  if (!container) return;

  const targetDate = new Date(weddingConfig.wedding.akad.startISO);

  function update() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      clearInterval(countdownInterval);
      container.classList.add("hidden");
      if (arrivedEl) {
        arrivedEl.textContent = "The Day Has Arrived";
        arrivedEl.classList.remove("hidden");
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setUnit("cd-days", days);
    setUnit("cd-hours", hours);
    setUnit("cd-minutes", minutes);
    setUnit("cd-seconds", seconds);
  }

  function setUnit(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, "0");
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

/* ---------- Add to Calendar ---------- */

function pad(n) { return String(n).padStart(2, "0"); }

function toGoogleCalendarDate(isoString) {
  const d = new Date(isoString);
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function buildGoogleCalendarUrl() {
  const { groom, bride } = weddingConfig.couple;
  const { reception } = weddingConfig.wedding;
  const title = encodeURIComponent(`The Wedding of ${groom.nickname} & ${bride.nickname}`);
  const details = encodeURIComponent(
    `Resepsi pernikahan ${groom.name} & ${bride.name} di ${reception.venue}.`
  );
  const location = encodeURIComponent(reception.address);
  const dates = `${toGoogleCalendarDate(reception.startISO)}/${toGoogleCalendarDate(reception.endISO)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function buildICSFile() {
  const { groom, bride } = weddingConfig.couple;
  const { reception } = weddingConfig.wedding;

  const icsDate = (isoString) => toGoogleCalendarDate(isoString);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//ID",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding-invitation`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(reception.startISO)}`,
    `DTEND:${icsDate(reception.endISO)}`,
    `SUMMARY:The Wedding of ${groom.nickname} & ${bride.nickname}`,
    `DESCRIPTION:Resepsi pernikahan ${groom.name} & ${bride.name}`,
    `LOCATION:${reception.address}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding-invitation.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initSaveTheDate() {
  const gcalBtn = document.getElementById("btn-google-calendar");
  const icsBtn = document.getElementById("btn-download-ics");

  if (gcalBtn) {
    gcalBtn.addEventListener("click", () => {
      window.open(buildGoogleCalendarUrl(), "_blank", "noopener");
    });
  }
  if (icsBtn) {
    icsBtn.addEventListener("click", buildICSFile);
  }
}
