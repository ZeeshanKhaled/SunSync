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
// =========================
// Making Of: scroll reveal + progress + subtle parallax
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const pageIsMaking = document.body.classList.contains("page-making");
  if (!pageIsMaking) return;

  // 1) Scroll reveal
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.18 }
  );
  revealEls.forEach(el => io.observe(el));

  // 2) Progress bar across the whole timeline section
  const progressFill = document.getElementById("makingProgressFill");
  const timeline = document.getElementById("timeline");
  const clamp01 = (n) => Math.max(0, Math.min(1, n));

  function updateProgress() {
    if (!progressFill || !timeline) return;

    const rect = timeline.getBoundingClientRect();
    const viewport = window.innerHeight;

    // Start when top enters viewport, end when bottom leaves
    const start = viewport * 0.2;
    const end = viewport * 0.85;

    const total = rect.height + (end - start);
    const progressed = (start - rect.top);

    const p = clamp01(progressed / total);
    progressFill.style.width = `${Math.round(p * 100)}%`;
  }

  // 3) Subtle parallax on media cards
  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax] .makingMedia"));

  function updateParallax() {
    const viewport = window.innerHeight;
    for (const media of parallaxItems) {
      const r = media.getBoundingClientRect();
      // Centered ratio (-1 to 1)
      const t = ((r.top + r.height * 0.5) - viewport * 0.5) / (viewport * 0.5);
      // max 10px shift
      const px = Math.max(-10, Math.min(10, -t * 10));
      media.style.setProperty("--parallax", `${px.toFixed(2)}px`);
    }
  }

  // Combined loop (lightweight)
  function onScroll() {
    updateProgress();
    updateParallax();
  }

  // Initial
  onScroll();

  // Events
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
