/* =============================================================================
   kt-visit — click-to-load wrapper for the Google Maps embed.
   Loaded once via section render. Uses event delegation so it survives
   theme-editor section re-renders (Section Rendering API replaces innerHTML
   without re-running inline <script> tags).
   ============================================================================= */
(function () {
  if (window.__ktVisitMapWired) return;
  window.__ktVisitMapWired = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.kt-visit__map-google[data-pending] [data-load-google]');
    if (!btn) return;
    var wrap = btn.closest('.kt-visit__map-google');
    var tpl = wrap && wrap.querySelector('template');
    if (!wrap || !tpl) return;
    wrap.innerHTML = tpl.innerHTML;
    wrap.removeAttribute('data-pending');
  });
})();
