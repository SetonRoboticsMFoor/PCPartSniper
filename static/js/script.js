const catSelect = document.getElementById('category-select');
const brandSelect = document.getElementById('brand-select');
const modelSelect = document.getElementById('model-select');
const priceDisplay = document.getElementById('price-display');
const saveBtn = document.getElementById('save-part-btn');
const savedList = document.getElementById('saved-parts-list');

// Load watchlist from browser storage
let watchlist = JSON.parse(localStorage.getItem('pcWatchlist')) || [];

// Initial render
renderWatchlist();

// --- DROPDOWN LOGIC ---

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

catSelect.addEventListener('change', () => {
    brandSelect.innerHTML = `<option value="">-- Select Brand --</option>`;
    modelSelect.innerHTML = `<option value="">-- Select Model --</option>`;
    brandSelect.disabled = true;
    modelSelect.disabled = true;
    priceDisplay.classList.add('hidden');

    if (catSelect.value) {
        populateDropdown(brandSelect, `/get_options?category=${encodeURIComponent(catSelect.value)}`);
    }
});

brandSelect.addEventListener('change', () => {
    modelSelect.innerHTML = `<option value="">-- Select Model --</option>`;
    modelSelect.disabled = true;
    priceDisplay.classList.add('hidden');

    if (brandSelect.value) {
        populateDropdown(modelSelect, `/get_options?category=${encodeURIComponent(catSelect.value)}&brand=${encodeURIComponent(brandSelect.value)}`);
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

// --- WATCHLIST LOGIC ---

saveBtn.addEventListener('click', () => {
    const partName = document.getElementById('selected-part-name').innerText;
    
    if (!watchlist.includes(partName)) {
        watchlist.push(partName);
        localStorage.setItem('pcWatchlist', JSON.stringify(watchlist));
        renderWatchlist();
    } else {
        alert("This part is already in your watchlist!");
    }
});

async function renderWatchlist() {
    if (watchlist.length === 0) {
        savedList.innerHTML = '<p style="color: #64748b; padding: 10px;">Your watchlist is empty.</p>';
        return;
    }

    // Temporary loading state while fetching prices
    savedList.innerHTML = '<p style="padding: 10px;">Updating live prices...</p>';

    let html = '';
    
    // Fetch prices for each item in the watchlist
    for (const part of watchlist) {
        try {
            const res = await fetch(`/prices?part=${encodeURIComponent(part)}`);
            const prices = await res.json();
            
            // Get the first price from the results
            const bestPrice = prices[0] ? prices[0].price : "N/A";
            const store = prices[0] ? prices[0].store : "Check Store";

            html += `
                <div class="saved-item">
                    <div class="item-info">
                        <span class="part-name">${part}</span>
                        <span class="part-price">${store}: <strong>${bestPrice}</strong></span>
                    </div>
                    <button class="delete-btn" onclick="removeFromWatchlist('${part}')">Remove</button>
                </div>
            `;
        } catch (err) {
            console.error("Error updating price for:", part);
        }
    }
    
    savedList.innerHTML = html;
}

window.removeFromWatchlist = (partName) => {
    watchlist = watchlist.filter(item => item !== partName);
    localStorage.setItem('pcWatchlist',