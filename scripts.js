/* =========================================================
   RoadPulse Logistics — script.js
   Handles: mobile nav toggle, fake shipment tracking lookup,
   and client-side quote form validation + fake submit.
   No backend — everything runs in the browser.
   ========================================================= */

   document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Footer year ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    /* ---------- Mobile nav toggle ---------- */
    var menuToggle = document.getElementById('menuToggle');
    var mainNav = document.getElementById('mainNav');
  
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', function () {
        var isOpen = mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
  
      // Close the mobile menu after tapping a link
      mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mainNav.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  
    /* ---------- Fake shipment tracking ---------- */
    // Hardcoded demo data — in a real product this would call an API.
    var shipmentDatabase = {
      'RP10234': { status: 'In Transit', detail: 'Left Chennai hub, expected in Bengaluru by tomorrow 10 AM.' },
      'RP58821': { status: 'Out for Delivery', detail: 'On a delivery vehicle in Pune, arriving today.' },
      'RP93012': { status: 'Delivered', detail: 'Delivered to the recipient in Delhi on schedule.' },
      'RP44120': { status: 'Picked Up', detail: 'Collected from sender in Mumbai, awaiting dispatch.' }
    };
  
    var trackForm = document.getElementById('trackForm');
    var trackInput = document.getElementById('trackingId');
    var trackResult = document.getElementById('trackResult');
  
    if (trackForm) {
      trackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = trackInput.value.trim().toUpperCase();
        trackResult.classList.remove('status-transit', 'status-delivered', 'status-notfound');
  
        if (!id) {
          trackResult.textContent = 'Enter a tracking ID above.';
          trackResult.classList.add('status-notfound');
          return;
        }
  
        var shipment = shipmentDatabase[id];
  
        if (!shipment) {
          trackResult.innerHTML = 'No shipment found for <strong>' + id + '</strong>. ' +
            'Try RP10234, RP58821, RP93012 or RP44120 — this is a demo dataset.';
          trackResult.classList.add('status-notfound');
          return;
        }
  
        trackResult.innerHTML = '<strong>' + id + '</strong> — ' + shipment.status + '<br>' + shipment.detail;
        trackResult.classList.add(shipment.status === 'Delivered' ? 'status-delivered' : 'status-transit');
      });
    }
  
    /* ---------- Quote form validation + fake submit ---------- */
    var quoteForm = document.getElementById('quoteForm');
    var quoteConfirm = document.getElementById('quoteConfirm');
  
    if (quoteForm) {
      var requiredFields = ['qName', 'qPhone', 'qPickup', 'qDrop'];
  
      quoteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;
  
        requiredFields.forEach(function (fieldId) {
          var field = document.getElementById(fieldId);
          var errorEl = quoteForm.querySelector('[data-error-for="' + fieldId + '"]');
          var value = field.value.trim();
          var message = '';
  
          if (!value) {
            message = 'This field is required.';
          } else if (fieldId === 'qPhone' && !/^[0-9+\-\s()]{7,15}$/.test(value)) {
            message = 'Enter a valid phone number.';
          }
  
          if (message) {
            isValid = false;
            field.classList.add('invalid');
            if (errorEl) errorEl.textContent = message;
          } else {
            field.classList.remove('invalid');
            if (errorEl) errorEl.textContent = '';
          }
        });
  
        if (!isValid) {
          quoteConfirm.textContent = '';
          return;
        }
  
        // No backend — simulate a successful submission.
        var name = document.getElementById('qName').value.trim();
        quoteConfirm.textContent = 'Thanks, ' + name + ' — we\'ll contact you shortly with a quote.';
        quoteForm.reset();
      });
  
      // Clear an error as soon as the person starts fixing that field
      requiredFields.forEach(function (fieldId) {
        var field = document.getElementById(fieldId);
        field.addEventListener('input', function () {
          field.classList.remove('invalid');
          var errorEl = quoteForm.querySelector('[data-error-for="' + fieldId + '"]');
          if (errorEl) errorEl.textContent = '';
        });
      });
    }
  
  });