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