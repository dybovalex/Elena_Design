// Läuft auf deiner Seite (außerhalb des IFRAMEs)
(() => {
  const DEBUG = false; // bei Bedarf true
  const ALLOWED_ORIGINS = [
    "elfsight.com",
    "static.elfsight.com",
    "files.elfsightcdn.com",
  ];

  const isAllowedOrigin = (origin) => {
    try {
      const o = String(origin || "").toLowerCase();
      return ALLOWED_ORIGINS.some((host) => o.includes(host));
    } catch {
      return false;
    }
  };

  const redirectToThanks = () => {
    if (DEBUG) console.log("[HOST] redirecting to /danke.html");
    setTimeout(() => {
      window.location.href = "/danke.html";
    }, 5000); // 5 Sekunden Verzögerung
  };

  window.addEventListener("message", (event) => {
    try {
      const data = event.data || {};
      // Falls lokal getestet wird, Origin-Prüfung lockern:
      const ok =
        isAllowedOrigin(event.origin) ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1";

      if (!ok) {
        if (DEBUG)
          console.log("[HOST] ignored origin:", event.origin, "data:", data);
        return;
      }

      if (DEBUG) console.log("[HOST] message from", event.origin, data);

      if (data && data.event === "booking_success") {
        redirectToThanks();
      }
    } catch (e) {
      if (DEBUG) console.warn("[HOST] message handler error", e);
    }
  });

  if (DEBUG) console.log("[HOST] booking listener active");
})();
