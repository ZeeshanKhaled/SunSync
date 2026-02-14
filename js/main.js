// SunSync - simple UI helpers
document.addEventListener("DOMContentLoaded", () => {
  // Active nav highlight
  const current = location.pathname.split("/").pop().toLowerCase();
  document.querySelectorAll(".navlinks a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === current) a.classList.add("active");
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById("menuBtn");
  const navlinks = document.getElementById("navlinks");
  if (menuBtn && navlinks) {
    menuBtn.addEventListener("click", () => {
      navlinks.classList.toggle("open");
      const expanded = navlinks.classList.contains("open");
      menuBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }
});
