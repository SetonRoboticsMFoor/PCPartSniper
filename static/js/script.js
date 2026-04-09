const catSelect = document.getElementById('category-select');
const brandSelect = document.getElementById('brand-select');
const modelSelect = document.getElementById('model-select');
const priceDisplay = document.getElementById('price-display');

// Helper to reset and fill a dropdown
async function populateDropdown(element, url) {
    const res = await fetch(url);
    const options = await res.json();
    
    element.innerHTML = `<option value="">-- Select Option --</option>`;
    options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        element.appendChild(o);
    });
    element.disabled = false;
}

// Logic flow
catSelect.addEventListener('change', () => {
    brandSelect.innerHTML = `<option value="">-- Select Brand --</option>`;
    modelSelect.innerHTML = `<option value="">-- Select Model --</option>`;
    modelSelect.disabled = true;
    priceDisplay.classList.add('hidden');

    if (catSelect.value) {
        populateDropdown(brandSelect, `/get_options?category=${catSelect.value}`);
    } else {
        brandSelect.disabled = true;
    }
});

brandSelect.addEventListener('change', () => {
    modelSelect.innerHTML = `<option value="">-- Select Model --</option>`;
    priceDisplay.classList.add('hidden');

    if (brandSelect.value) {
        populateDropdown(modelSelect, `/get_options?category=${catSelect.value}&brand=${brandSelect.value}`);
    } else {
        modelSelect.disabled = true;
    }
});

modelSelect.addEventListener('change', async () => {
    if (modelSelect.value) {
        const part = modelSelect.value;
        document.getElementById('selected-part-name').innerText = part;
        priceDisplay.classList.remove('hidden');

        const res = await fetch(`/prices?part=${encodeURIComponent(part)}`);
        const prices = await res.json();

        const list = document.getElementById('price-results');
        list.innerHTML = prices.map(p => `
            <li class="price-item">
                <span>${p.store}</span>
                <strong>${p.price}</strong>
            </li>
        `).join('');
    }
});

const saveBtn = document.getElementById('save-part-btn');
const savedList = document.getElementById('saved-parts-list');

// Load watchlist from browser storage on startup
let watchlist = JSON.parse(localStorage.getItem('pcWatchlist')) || [];
renderWatchlist();

saveBtn.addEventListener('click', () => {
    const partName = document.getElementById('selected-part-name').innerText;
    
    // Don't add duplicates
    if (!watchlist.includes(partName)) {
        watchlist.push(partName);
        localStorage.setItem('pcWatchlist', JSON.stringify(watchlist));
        renderWatchlist();
    } else {
        alert("This part is already in your watchlist!");
    }
});

function renderWatchlist() {
    if (watchlist.length === 0) {
        savedList.innerHTML = '<p style="color: #64748b;">Your watchlist is empty.</p>';
        return;
    }

    savedList.innerHTML = watchlist.map((part, index) => `
        <div class="saved-item">
            <span>${part}</span>
            <button class="delete-btn" onclick="removeFromWatchlist(${index})">Remove</button>
        </div>
    `).join('');
}

// Global function so the "onclick" in the HTML can find it
window.removeFromWatchlist = (index) => {
    watchlist.splice(index, 1);
    localStorage.setItem('pcWatchlist', JSON.stringify(watchlist));
    renderWatchlist();
};