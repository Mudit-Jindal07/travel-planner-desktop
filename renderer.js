// renderer.js

let currentDraftTrip = null;
let savedTrips = [];

function switchView(target) {
  document.querySelectorAll('.view-section').forEach(el => {
    el.classList.toggle('hidden', el.id !== `view-${target}`);
  });
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.id === `nav-${target}`);
  });
  if (target === 'trips') renderSavedTripsList();
}

document.addEventListener('DOMContentLoaded', () => {
  const navMap = {
    'nav-dashboard': 'dashboard',
    'nav-create': 'create',
    'nav-trips': 'trips',
    'btn-quick-create': 'create',
    'btn-get-started': 'create',
    'btn-empty-create': 'create',
    'btn-back-to-dashboard': 'dashboard'
  };
  Object.entries(navMap).forEach(([id, view]) => {
    document.getElementById(id)?.addEventListener('click', () => switchView(view));
  });
});
