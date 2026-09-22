/* ==========================================================================
   BLCKGROOVE — Footer behaviour
   Loads components/footer.html into the page, then wires up the
   "Back to top" smooth-scroll control.
   ========================================================================== */

async function loadFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  try {
    const response = await fetch('components/footer.html');
    if (!response.ok) throw new Error(`Footer fetch failed: ${response.status}`);
    root.innerHTML = await response.text();
  } catch (error) {
    // Fetching a local file fails under file:// — serve the project with a
    // local dev server (e.g. `npx serve`, VS Code Live Server) or deploy it.
    console.error('Could not load footer component.', error);
    return;
  }

  initBackToTop();
  window.dispatchEvent(new CustomEvent('footer:ready'));
}

function initBackToTop() {
  const trigger = document.querySelector('[data-back-to-top]');
  if (!trigger) return;

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
