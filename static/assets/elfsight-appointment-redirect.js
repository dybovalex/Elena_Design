// elfsight-appointment-redirect.js
(function () {
  // 1) Hilfsfunktion: sicher umleiten
  function redirectToThanks() {
    setTimeout(() => {
      window.location.href = "/danke.html";
    }, 1200);
  }

  // 2) Optional: Debug einschalten, um zu sehen, was vom Iframe kommt
  const DEBUG = false; // bei Bedarf auf true setzen

  // 3) Auf Nachrichten (postMessage) aus Elfsight-Iframes hören
  window.addEventListener("message", function (event) {
    try {
      // Nur Nachrichten aus Elfsight/Calendly/Booking-Widget weiter betrachten
      const origin = String(event.origin || "").toLowerCase();
      if (
        !origin.includes("elfsight") &&
        !origin.includes("booking") &&
        !origin.includes("calend") // falls intern ein Kalenderdienst genutzt wird
      ) {
        if (DEBUG) console.log("[ELFSIGHT] Ignored message from", origin);
        return;
      }

      const data = event.data;
      if (DEBUG) console.log("[ELFSIGHT] message:", data);

      // Daten können String oder Objekt sein – beide prüfen
      const text =
        typeof data === "string"
          ? data.toLowerCase()
          : JSON.stringify(data || {}).toLowerCase();

      // Häufige Schlüsselwörter beim Abschluss
      const markers = [
        "buchung bestätigt",
        "booking confirmed",
        "appointment booked",
        "booking_success",
        "booking-completed",
        "success",
        "confirmed",
        "Ihre Buchung ist bestätigt",
      ];

      if (markers.some((m) => text.includes(m))) {
        if (DEBUG) console.log("[ELFSIGHT] success detected → redirect");
        redirectToThanks();
      }
    } catch (e) {
      if (DEBUG) console.warn("[ELFSIGHT] message parse error:", e);
    }
  });

  // 4) Fallback: wenn das Widget die URL hash/param ändert (selten), beobachten
  window.addEventListener("hashchange", () => {
    const h = (location.hash || "").toLowerCase();
    if (h.includes("success") || h.includes("confirmed")) redirectToThanks();
  });

  // 5) Minimaler Sichtbarkeits-Ping fürs Debugging
  if (DEBUG) console.log("[ELFSIGHT] redirect listener active");
})();
