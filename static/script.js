const searchInput = document.getElementById('part-search');
const autocompleteList = document.getElementById('autocomplete-list');
const priceDisplay = document.getElementById('price-display');

// 1. Autofill logic
searchInput.addEventListener('input', async (e) => {
    const val = e.target.value;
    if (val.length < 3) {
        autocompleteList.innerHTML = '';
        return;
    }

    // Relative path works because JS and Python are on the same server
    const res = await fetch(`/search?q=${val}`);
    const data = await res.json();
    
    autocompleteList.innerHTML = '';
    data.results.forEach(part => {
        const item = document.createElement('div');
        item.textContent = part;
        item.onclick = () => {
            searchInput.value = part;
            autocompleteList.innerHTML = '';
            showPrices(part);
        };
        autocompleteList.appendChild(item);
    });
});

// 2. Price Fetching
async function showPrices(part) {
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