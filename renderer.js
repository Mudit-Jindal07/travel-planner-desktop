// renderer.js

let currentDraftTrip = null, savedTrips = [];

const DESTINATION_ACTIVITIES = {
  Jaipur: ["Amber Fort Tour", "Rajasthani Thali Lunch", "City Palace & Hawa Mahal", "Nahargarh Sunset", "Johari Bazaar Shopping", "Chokhi Dhani Dinner"],
  Goa: ["Baga Beach Walk", "Watersports at Island", "Goan Seafood Shack", "Old Goa Churches", "Anjuna Flea Market", "Sunset River Cruise"],
  Manali: ["Solang Valley Adventure", "Hadimba Wooden Temple", "Old Manali Cafe Lunch", "Jogini Waterfalls Trail", "Mall Road Souvenirs", "Vashisht Hot Springs"],
  Kerala: ["Alleppey Houseboat", "Munnar Tea Plantation", "Kerala Sadhya Lunch", "Fort Kochi Chinese Nets", "Local Spice Market", "Kathakali Dance Show"],
  Tokyo: ["Senso-ji Temple Asakusa", "Tsukiji Street Food", "Shibuya Crossing", "Shinjuku Landscape Garden", "Akihabara Tech Stores", "Tokyo Skytree Sunset"],
  Paris: ["Eiffel Tower & Park", "French Bistro Lunch", "Louvre Art Museum", "Seine River Evening Cruise", "Montmartre Painters Square", "Champs-Elysees Walk"]
};

function generateItinerary(destination, days) {
  const list = DESTINATION_ACTIVITIES[destination] || DESTINATION_ACTIVITIES.Jaipur;
  const itinerary = [];
  let i = 0;
  for (let day = 1; day <= days; day++) {
    itinerary.push({
      day,
      slots: [
        { time: "Morning",   title: list[i++ % list.length] },
        { time: "Afternoon", title: list[i++ % list.length] },
        { time: "Evening",   title: list[i++ % list.length] }
      ]
    });
  }
  return itinerary;
}

function generatePackingList(destination) {
  const common = [
    "Government ID & Travel Tickets",
    "Phone Charger & Power Bank",
    "Comfortable Walking Shoes",
    "Daily Clothes & Toiletries Kit",
    "Basic Medicines & First-Aid"
  ];
  const cityGear = {
    Goa: ["Sunscreen & Sunglasses", "Swimwear & Beach Slippers"],
    Manali: ["Heavy Winter Jacket", "Woollen Caps & Gloves"],
    Jaipur: ["Sun Hat & Cotton Stole", "Reusable Water Bottle"],
    Kerala: ["Mosquito Repellent", "Compact Umbrella / Rainwear"],
    Tokyo: ["Coin Pouch for Cash", "Easy Slip-On Shoes"],
    Paris: ["Smart Casual Evening Wear", "Secure Crossbody Bag"]
  };
  const extra = cityGear[destination] || ["Travel Diary & Notes"];
  return [...common, ...extra].map(text => ({ text, checked: false }));
}

function calculateBudgetBreakdown(totalBudget) {
  return [
    { name: "🏨 Accommodation",       percent: 40, amount: Math.round(totalBudget * 0.40), color: "#2563eb" },
    { name: "🍲 Food & Dining",        percent: 25, amount: Math.round(totalBudget * 0.25), color: "#0284c7" },
    { name: "🚕 Local Transport",      percent: 15, amount: Math.round(totalBudget * 0.15), color: "#0d9488" },
    { name: "🎟️ Sightseeing & Entry",  percent: 12, amount: Math.round(totalBudget * 0.12), color: "#f59e0b" },
    { name: "🛍️ Miscellaneous",         percent: 8,  amount: Math.round(totalBudget * 0.08), color: "#8b5cf6" }
  ];
}

function renderBudgetBreakdown(trip) {
  document.getElementById('budget-total-badge').textContent = `₹${trip.budget.toLocaleString('en-IN')} Total`;
  document.getElementById('budget-chart-bar').innerHTML = trip.budgetBreakdown.map(c => `
    <div class="budget-segment" style="width:${c.percent}%;background-color:${c.color};" title="${c.name}: ${c.percent}%"></div>
  `).join('');
  document.getElementById('budget-categories-container').innerHTML = trip.budgetBreakdown.map(c => `
    <div class="budget-category-row">
      <div class="budget-category-label">
        <span class="category-dot" style="background-color:${c.color};"></span>
        <span>${c.name}</span>
      </div>
      <div class="budget-category-values">
        <span class="category-percent">${c.percent}%</span>
        <span class="category-amount">₹${c.amount.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `).join('');
}

function renderTripDetails(trip) {
  document.getElementById('details-trip-title').textContent = trip.name;
  document.getElementById('details-meta-tags').innerHTML = `
    <span class="meta-tag highlight">📍 ${trip.destination}</span>
    <span class="meta-tag">📅 ${trip.days} Days</span>
    <span class="meta-tag">💰 ₹${trip.budget.toLocaleString('en-IN')}</span>
    ${trip.interests.map(i => `<span class="meta-tag">🏷️ ${i}</span>`).join('')}
  `;
  document.getElementById('itinerary-day-count').textContent = `${trip.days} Days Planned`;

  document.getElementById('itinerary-timeline-container').innerHTML = trip.itinerary.map(day => `
    <div class="day-card">
      <div class="day-card-header">
        <span class="day-badge">Day ${day.day}</span>
        <span class="day-theme-title">${trip.destination} Plan</span>
      </div>
      <div class="day-slots-list">
        ${day.slots.map(s => `
          <div class="activity-slot">
            <span class="slot-time">⏰ ${s.time}</span>
            <div class="slot-content"><h5>${s.title}</h5></div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  renderBudgetBreakdown(trip);
  renderChecklist(trip);
}

function renderChecklist(trip) {
  const total = trip.packingList.length;
  const checked = trip.packingList.filter(i => i.checked).length;
  document.getElementById('packing-counter').textContent = `${checked} / ${total} Packed`;

  const container = document.getElementById('packing-checklist-container');
  container.innerHTML = trip.packingList.map((item, idx) => `
    <li class="checklist-item ${item.checked ? 'checked' : ''}">
      <input type="checkbox" id="chk-${idx}" ${item.checked ? 'checked' : ''} />
      <label for="chk-${idx}">${item.text}</label>
    </li>
  `).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach((box, idx) => {
    box.addEventListener('change', e => {
      trip.packingList[idx].checked = e.target.checked;
      renderChecklist(trip);
      if (savedTrips.some(t => t.id === trip.id)) window.travelAPI?.saveTrips(savedTrips);
    });
  });
}

async function loadSavedTrips() {
  savedTrips = (await window.travelAPI?.loadTrips()) || [];
  renderSavedTripsList();
}

async function saveCurrentTrip() {
  if (!currentDraftTrip) return;
  const idx = savedTrips.findIndex(t => t.id === currentDraftTrip.id);
  if (idx >= 0) savedTrips[idx] = currentDraftTrip;
  else savedTrips.unshift(currentDraftTrip);

  await window.travelAPI?.saveTrips(savedTrips);
  renderSavedTripsList();

  const btn = document.getElementById('btn-save-current-trip');
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = `<span>✅</span> Saved to Disk!`;
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  }
}

function renderSavedTripsList() {
  const countBadge = document.getElementById('stat-total-trips');
  if (countBadge) countBadge.textContent = savedTrips.length;

  const grid = document.getElementById('saved-trips-grid');
  const emptyMsg = document.getElementById('saved-trips-empty');
  if (!grid || !emptyMsg) return;

  if (savedTrips.length === 0) {
    grid.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');
  grid.innerHTML = savedTrips.map(trip => `
    <div class="saved-trip-card">
      <div>
        <h4 class="saved-trip-title">${trip.name}</h4>
        <div class="saved-trip-details">
          <span class="saved-trip-tag">📍 ${trip.destination}</span>
          <span class="saved-trip-tag">📅 ${trip.days} Days</span>
          <span class="saved-trip-tag">💰 ₹${trip.budget.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div class="saved-trip-actions">
        <button class="btn btn-outline btn-sm btn-open" data-id="${trip.id}">Open Plan →</button>
        <button class="btn-danger btn-delete" data-id="${trip.id}">Delete</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.btn-open').forEach(btn => {
    btn.addEventListener('click', () => {
      const trip = savedTrips.find(t => t.id === btn.getAttribute('data-id'));
      if (trip) {
        currentDraftTrip = trip;
        renderTripDetails(trip);
        switchView('details');
      }
    });
  });

  grid.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteTrip(btn.getAttribute('data-id')));
  });
}

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

  document.getElementById('btn-save-current-trip')?.addEventListener('click', saveCurrentTrip);

  setupCreateTripForm();
  loadSavedTrips();
});
async function deleteTrip(tripId) {
  savedTrips = savedTrips.filter(t => t.id !== tripId);
  await window.travelAPI?.saveTrips(savedTrips);
  renderSavedTripsList();
}

