(() => {
  const DEBUG = false; // bei Bedarf auf true

  // Erlaube eigenes Origin + Elfsight-Hosts
  const ALLOWED_ORIGINS = [
    window.location.origin, // z.B. https://elena-designcoach.at
    "https://elfsight.com",
    "https://static.elfsight.com",
    "https://files.elfsightcdn.com",
  ];

  const isAllowedOrigin = (origin) => {
    try {
      return ALLOWED_ORIGINS.some((o) =>
        origin.toLowerCase().startsWith(o.toLowerCase())
      );
    } catch {
      return false;
    }
  };

  const redirectToThanks = () => {
    if (DEBUG) console.log("[HOST] redirecting to /danke.html");
    setTimeout(() => {
      window.location.href = "/danke.html";
    }, 2000); // 2 Sek.
  };

  window.addEventListener("message", (event) => {
    try {
      if (!isAllowedOrigin(event.origin)) {
        if (DEBUG)
          console.log("[HOST] ignored origin:", event.origin, event.data);
        return;
      }
      const data = event.data || {};
      if (DEBUG) console.log("[HOST] message from", event.origin, data);

      if (data.event === "booking_success") {
        redirectToThanks();
      }
    } catch (e) {
      if (DEBUG) console.warn("[HOST] message handler error", e);
    }
  });

  if (DEBUG) console.log("[HOST] booking listener active");
})();
