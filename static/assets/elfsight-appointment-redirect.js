// elfsight-appointment-redirect.js
(function () {
    const SUCCESS_MARKERS = [
      'buchung bestätigt',           // DE (aus deinem Screenshot)
      'termin gebucht',
      'buchung erfolgreich',
      'booking confirmed',           // EN fallback
      'appointment booked'
    ];
  
    function redirect() {
      setTimeout(() => { window.location.href = '/danke.html'; }, 1200);
    }
  
    function containsSuccess(node) {
      if (!node) return false;
      const text = (node.innerText || node.textContent || '').toLowerCase();
      if (!text) return false;
  
      // Marker im Fließtext
      if (SUCCESS_MARKERS.some(m => text.includes(m))) return true;
  
      // Häufige Erfolgs-/Status-Container
      const hit = node.matches?.('[role="status"],[aria-live="polite"],.success,.confirmed,.thank-you')
        || node.querySelector?.('[role="status"],[aria-live="polite"],.success,.confirmed,.thank-you');
      return !!hit;
    }
  
    function watch(root) {
      if (containsSuccess(root)) return redirect();
  
      const obs = new MutationObserver(muts => {
        for (const m of muts) {
          for (const n of m.addedNodes || []) {
            if (n.nodeType === 1 && containsSuccess(n)) {
              obs.disconnect();
              return redirect();
            }
          }
        }
      });
      obs.observe(root, { childList: true, subtree: true });
    }
  
    function waitForElfsight(tries = 80) {
      // Versuche zuerst den Elfsight-Container, sonst fallback auf body
      const widget = document.querySelector('[class^="elfsight-app-"], [class*=" elfsight-app-"]');
      if (widget) return watch(widget);
      if (tries <= 0) return watch(document.body);
      setTimeout(() => waitForElfsight(tries - 1), 500);
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForElfsight);
    } else {
      waitForElfsight();
    }
  })();
  