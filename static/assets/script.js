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

// Galerie carousel
(() => {
  const track = document.getElementById("galleryTrack");
  if (!track) return;

  const imagePaths = [
    "./static/images/Galerie/1_Wohnraum.jpg",
    "./static/images/Galerie/2_Wohnraum.jpg",
    "./static/images/Galerie/3_Wohnraum.jpg",
    "./static/images/Galerie/4a_Wohnraum.jpg",
    "./static/images/Galerie/6_Kueche.jpg",
    "./static/images/Galerie/8_Kueche.jpg",
    "./static/images/Galerie/11_Kleiderschrank.jpg",
    "./static/images/Galerie/17_Einfamilienhaus.jpg",
    "./static/images/Galerie/20_Einfamilienhaus.jpg",
    "./static/images/Galerie/21_Einfamilienhaus.jpg",
    "./static/images/Galerie/24_Haus.jpg",
    "./static/images/Galerie/35_ED0035.jpg",
    "./static/images/Galerie/54_ED0054.jpg",
    "./static/images/Galerie/58_ED0058 c.jpg",
    "./static/images/Galerie/59_ED0059 a.jpg",
    "./static/images/Galerie/59_ED0059 c.jpg",
    "./static/images/Galerie/62_ED0062.jpg",
    "./static/images/Galerie/67_ED0067 e.jpg",
    "./static/images/Galerie/69_ED0069 b.jpg",
    "./static/images/Galerie/70_ED0070 e.jpg",
    "./static/images/Galerie/75_ED0075.jpg",
    "./static/images/Galerie/91_ED0091.jpg",
    "./static/images/Galerie/96_ED0096.jpg",
    "./static/images/Galerie/97_ED0097.jpg",
    "./static/images/Galerie/104_ED00104 a.jpg",
    "./static/images/Galerie/110_ED00110.jpg",
    "./static/images/Galerie/115_ED00115 b.jpg",
    "./static/images/Galerie/118_ED00118 a.jpg",
    "./static/images/Galerie/137_ED0137.jpg",
    "./static/images/Galerie/139_ED0139.jpg",
    "./static/images/Galerie/160_ED0160.jpg",
    "./static/images/Galerie/166_ED0166c.jpg",
  ];

  // Inject slides
  track.innerHTML = imagePaths
    .map(
      (src) =>
        `<figure class="carousel__item"><img src="${src}" alt="Galerie Bild" loading="lazy" /></figure>`
    )
    .join("");

  const viewport = track.parentElement;
  let index = 0;

  const slidesPerView = () => (window.innerWidth <= 900 ? 1 : 3);
  const update = () => {
    const gap = 16;
    const perView = slidesPerView();
    const slideWidth = (viewport.clientWidth - (perView - 1) * gap) / perView;
    const offset = index * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  };

  const clampIndex = () => {
    const perView = slidesPerView();
    const maxIndex = Math.max(0, imagePaths.length - perView);
    index = Math.min(Math.max(index, 0), maxIndex);
  };

  const prev = document.querySelector(".carousel__arrow--prev");
  const next = document.querySelector(".carousel__arrow--next");
  prev?.addEventListener("click", () => {
    index -= 1; // move by one image
    clampIndex();
    update();
  });
  next?.addEventListener("click", () => {
    index += 1; // move by one image
    clampIndex();
    update();
  });

  // Autoplay
  let timer = setInterval(() => {
    index += 1; // advance by one image
    const perView = slidesPerView();
    if (index > imagePaths.length - perView) index = 0;
    update();
  }, 4500);

  // Pause on hover
  viewport.addEventListener("mouseenter", () => clearInterval(timer));
  viewport.addEventListener("mouseleave", () => {
    timer = setInterval(() => {
      index += 1; // advance by one image
      const perView = slidesPerView();
      if (index > imagePaths.length - perView) index = 0;
      update();
    }, 4500);
  });

  window.addEventListener("resize", () => {
    clampIndex();
    update();
  });

  // Initial
  clampIndex();
  update();
})();
