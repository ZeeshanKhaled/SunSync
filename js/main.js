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
// ===== LED scroll-reactive glow (FeatureOverview only) =====
(() => {
  const body = document.body;
  if (!body.classList.contains("page-features")) return;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const updateLed = () => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const maxScroll = (doc.scrollHeight - window.innerHeight) || 1;
    const t = clamp01(scrollTop / maxScroll); // 0 at top, 1 at bottom

    // Warm is strongest at top, cool strongest at bottom
    const warm = 0.25 + (1 - t) * 0.85;  // 1.10 -> 0.25-ish
    const cool = 0.25 + t * 0.85;        // 0.25 -> 1.10-ish

    // Sides blend between warm/cool slightly
    const sideA = 0.20 + (1 - t) * 0.65;
    const sideB = 0.20 + t * 0.65;

    // Overall glow strength (slight bump mid scroll looks nice)
    const glow = 0.35 + Math.sin(t * Math.PI) * 0.25; // 0.35..0.60

    body.style.setProperty("--ledWarm", warm.toFixed(3));
    body.style.setProperty("--ledCool", cool.toFixed(3));
    body.style.setProperty("--ledSideA", sideA.toFixed(3));
    body.style.setProperty("--ledSideB", sideB.toFixed(3));
    body.style.setProperty("--ledGlow", glow.toFixed(3));
  };

  updateLed();
  window.addEventListener("scroll", updateLed, { passive: true });
  window.addEventListener("resize", updateLed);
})();
