// Mobile menu toggle
const burger = document.querySelector(".burger");
const mobile = document.getElementById("mobileMenu");

const isMobileView = () => window.innerWidth <= 900;

burger?.addEventListener("click", () => {
  if (isMobileView()) {
    const isCurrentlyVisible = mobile.style.display === "block";
    mobile.style.display = isCurrentlyVisible ? "none" : "block";
    burger.setAttribute("aria-expanded", String(!isCurrentlyVisible));
  }
});

mobile?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    if (isMobileView()) {
      mobile.style.display = "none";
      burger.setAttribute("aria-expanded", "false");
    }
  })
);

// Ensure menu is hidden on large screens if it was left open by resizing
window.addEventListener("resize", () => {
  if (!isMobileView()) {
    mobile.style.display = "none";
    burger.setAttribute("aria-expanded", "false");
  }
});
