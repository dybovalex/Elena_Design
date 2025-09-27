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

// Navigate to Referenz-Galerie from buttons
document.querySelectorAll("#button-galerie").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "./Referenz-Galerie.html";
  });
});

// Navigate to Partner from buttons
document.querySelectorAll("#button-partner").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "./Partner.html";
  });
});

// Lightbox for Referenz-Galerie
(() => {
  const grid = document.querySelector(".galery-grid");
  const overlay = document.getElementById("lightbox");
  const imageEl = document.getElementById("lightboxImage");
  const btnClose = document.getElementById("lightboxClose");
  const btnPrev = document.getElementById("lightboxPrev");
  const btnNext = document.getElementById("lightboxNext");
  if (!grid || !overlay || !imageEl) return;

  const thumbs = Array.from(grid.querySelectorAll("img"));
  let currentIndex = 0;

  const updateImage = () => {
    const src = thumbs[currentIndex]?.getAttribute("src");
    const alt = thumbs[currentIndex]?.getAttribute("alt") || "Großansicht";
    if (src) {
      imageEl.setAttribute("src", src);
      imageEl.setAttribute("alt", alt);
    }
  };

  const openAt = (index) => {
    currentIndex = index;
    updateImage();
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const step = (delta) => {
    const len = thumbs.length;
    currentIndex = (currentIndex + delta + len) % len;
    updateImage();
  };

  thumbs.forEach((img, idx) => {
    img.addEventListener("click", () => openAt(idx));
  });

  btnClose?.addEventListener("click", close);
  btnPrev?.addEventListener("click", () => step(-1));
  btnNext?.addEventListener("click", () => step(1));

  // Click outside the image closes
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (overlay.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
