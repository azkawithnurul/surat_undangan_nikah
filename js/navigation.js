/**
 * navigation.js
 * Floating navigation dengan active state berdasarkan section yang terlihat.
 */

function initNavigation() {
  const navItems = document.querySelectorAll("[data-nav-target]");
  const bottomNav = document.getElementById("bottom-nav");
  const topNav = document.getElementById("top-nav");

  if (navItems.length === 0) return;

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.getAttribute("data-nav-target");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const sections = Array.from(navItems)
    .map((item) => document.getElementById(item.getAttribute("data-nav-target")))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spyObserver.observe(section));

  function setActiveNav(id) {
    navItems.forEach((item) => {
      item.classList.toggle("is-active", item.getAttribute("data-nav-target") === id);
    });
  }

  /* Tampilkan navigasi hanya setelah undangan dibuka (dipanggil dari app.js) */
  window.__showNav = () => {
    if (bottomNav) bottomNav.classList.add("is-visible");
    if (topNav) topNav.classList.add("is-visible");
  };
}
