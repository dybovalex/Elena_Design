(() => {
  const DEBUG = true; // Debug AN, damit wir in Prod sehen, was ankommt

  const redirectToThanks = () => {
    if (DEBUG) console.log("[HOST] redirecting to /danke.html");
    setTimeout(() => {
      window.location.href = "/danke.html";
    }, 2000);
  };

  // Wichtig: vorübergehend KEINE Origin-Filterung; wir vertrauen auf unser eigenes Event
  window.addEventListener("message", (event) => {
    try {
      if (DEBUG) console.log("[HOST] message from", event.origin, event.data);
      const data = event.data || {};
      if (data && data.event === "booking_success") {
        redirectToThanks();
      }
    } catch (e) {
      if (DEBUG) console.warn("[HOST] message handler error", e);
    }
  });

  if (DEBUG) console.log("[HOST] booking listener active");
})();
