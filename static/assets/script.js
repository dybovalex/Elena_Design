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
    "./static/images/Galerie/Nebengebaeude Render.jpg",
    "./static/images/Galerie/Wohnzimmer Leseecke 3D.jpg",
    "./static/images/Galerie/Moosbild Logo.jpg",
    "./static/images/Galerie/Kueche Render.jpg",
    "./static/images/Galerie/Schlafzimmer Beleuchtung.jpg",
    "./static/images/Galerie/Bar Moderndesign.jpg",
    "./static/images/Galerie/Kinderzimmer Planen.jpg",
    "./static/images/Galerie/Kueche Esszimmer Render.jpg",
    "./static/images/Galerie/Kueche 3D Planung.jpg",
    "./static/images/Galerie/Bar Planung.jpg",
    "./static/images/Galerie/Haus Fassade 3D Planen.jpg",
    "./static/images/Galerie/Wohnzimmer Interiordesign.jpg",
    "./static/images/Galerie/Leseecke Wohlfuehlen.jpg",
    "./static/images/Galerie/Eingangsbereich Design.jpg",
    "./static/images/Galerie/Wohnzimmer Planung.jpg",
    "./static/images/Galerie/Haus Render.jpg",
    "./static/images/Galerie/Haus Beleuchtung.jpg",
    "./static/images/Galerie/Haus Terrasse.jpg",
    "./static/images/Galerie/Wohnraum Designkonzept Modern.jpg",
    "./static/images/Galerie/Einfamilienhaus 3D.jpg",
    "./static/images/Galerie/Wohnzimmer Licht.jpg",
    "./static/images/Galerie/Bad Modern.jpg",
    "./static/images/Galerie/Bad Konzept.jpg",
    "./static/images/Galerie/Wohnzimmer Moebel.jpg",
    "./static/images/Galerie/Office Homeoffice.jpg",
    "./static/images/Galerie/Logo Moos Render.jpg",
    "./static/images/Galerie/Garderobe Ordnung.jpg",
    "./static/images/Galerie/Wohnzimmer Tapette.jpg",
    "./static/images/Galerie/Wohnraum Design.jpg",
    "./static/images/Galerie/Bad Design.jpg",
    "./static/images/Galerie/Carport Photovoltaik.jpg",
    "./static/images/Galerie/Restaurant Visualisierung.jpg",
  ];

  // Inject slides with alt text derived from filename
  const getAltFromPath = (src) =>
    src
      .split("/")
      .pop()
      .replace(/\.[^.]+$/, "");
  track.innerHTML = imagePaths
    .map((src) => {
      const alt = getAltFromPath(src);
      return `<figure class="carousel__item"><img src="${src}" alt="${alt}" loading="lazy" /></figure>`;
    })
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

// Links for Galerie and Partner are handled directly via anchor hrefs in HTML

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

// Button_up logic

document.addEventListener("DOMContentLoaded", () => {
  const buttonUp = document.querySelector(".button_up");
  if (!buttonUp) return;

  const toggleVisibility = () => {
    if (window.scrollY > 800) {
      buttonUp.classList.add("is-visible");
    } else {
      buttonUp.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  const anchor = buttonUp.querySelector("a");
  if (anchor) {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Progress ring logic
  const progressCircle = document.querySelector(".progress-ring__progress");
  const radius = 22; // From SVG r value
  const circumference = 2 * Math.PI * radius;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    const setProgress = (progressRatio) => {
      const offset =
        circumference * (1 - Math.min(Math.max(progressRatio, 0), 1));
      progressCircle.style.strokeDashoffset = `${offset}`;
    };

    const computeScrollRatio = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = Math.max(docHeight - winHeight, 1);
      return scrollTop / scrollable;
    };

    const updateProgress = () => setProgress(computeScrollRatio());

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }
});
