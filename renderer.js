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

function setupCreateTripForm() {
  const form = document.getElementById('form-create-trip');
  const errorMsg = document.getElementById('form-error-msg');

  document.getElementById('btn-cancel-create')?.addEventListener('click', () => {
    form.reset();
    errorMsg.classList.add('hidden');
    switchView('dashboard');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('trip-name').value.trim();
    const destination = document.getElementById('trip-destination').value;
    const days = parseInt(document.getElementById('trip-days').value, 10);
    const budget = parseFloat(document.getElementById('trip-budget').value);
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);

    if (!name || !destination || isNaN(days) || isNaN(budget) || interests.length === 0) {
      errorMsg.textContent = 'Please fill out all fields and choose at least one interest.';
      errorMsg.classList.remove('hidden');
      return;
    }

    errorMsg.classList.add('hidden');
    currentDraftTrip = {
      id: `trip-${Date.now()}`,
      name,
      destination,
      days,
      budget,
      interests,
      itinerary: generateItinerary(destination, days),
      budgetBreakdown: calculateBudgetBreakdown(budget),
      packingList: generatePackingList(destination)
    };

    renderTripDetails(currentDraftTrip);
    switchView('details');
  });
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
