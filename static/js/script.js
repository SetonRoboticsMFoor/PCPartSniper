document.addEventListener('DOMContentLoaded', () => {
    const catSelect = document.getElementById('category-select');
    const brandSelect = document.getElementById('brand-select');
    const modelSelect = document.getElementById('model-select');
    const priceDisplay = document.getElementById('price-display');
    const saveBtn = document.getElementById('save-part-btn');
    const savedList = document.getElementById('saved-parts-list');

    let watchlist = JSON.parse(localStorage.getItem('pcWatchlist')) || [];

    async function init() {
        await populateDropdown(catSelect, '/get_options', "-- Select Category --");
        renderWatchlist();
    }

    async function populateDropdown(element, url, defaultText) {
        try {
            const res = await fetch(url);
            const options = await res.json();
            element.innerHTML = `<option value="">${defaultText}</option>`;
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.textContent = opt;
                element.appendChild(o);
            });
            element.disabled = false;
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    catSelect.addEventListener('change', () => {
        brandSelect.innerHTML = `<option value="">-- Loading Brands... --</option>`;
        modelSelect.innerHTML = `<option value="">-- Select Brand First --</option>`;
        brandSelect.disabled = true;
        modelSelect.disabled = true;
        priceDisplay.classList.add('hidden');
        if (catSelect.value) {
            populateDropdown(brandSelect, `/get_options?category=${encodeURIComponent(catSelect.value)}`, "-- Select Brand --");
        }
    });

    brandSelect.addEventListener('change', () => {
        modelSelect.innerHTML = `<option value="">-- Loading Models... --</option>`;
        modelSelect.disabled = true;
        priceDisplay.classList.add('hidden');
        if (brandSelect.value) {
            populateDropdown(modelSelect, `/get_options?category=${encodeURIComponent(catSelect.value)}&brand=${encodeURIComponent(brandSelect.value)}`, "-- Select Model --");
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
                    <span>${p.store}: <strong>${p.price}</strong></span>
                    <a href="${p.url}" target="_blank" class="buy-link">View Deal</a>
                </li>
            `).join('');
        }
    });

    saveBtn.addEventListener('click', () => {
        const partName = document.getElementById('selected-part-name').innerText;
        if (!watchlist.includes(partName)) {
            watchlist.push(partName);
            localStorage.setItem('pcWatchlist', JSON.stringify(watchlist));
            renderWatchlist();
        }
    });

    async function renderWatchlist() {
        if (watchlist.length === 0) {
            savedList.innerHTML = '<p style="color: #64748b; padding: 10px;">Your watchlist is empty.</p>';
            return;
        }

        savedList.innerHTML = '<p style="padding: 10px;">Updating prices...</p>';
        let html = '';
        for (const part of watchlist) {
            try {
                const res = await fetch(`/prices?part=${encodeURIComponent(part)}`);
                const prices = await res.json();
                
                // Assuming best price is the first one
                const best = prices[0] || { price: "N/A", store: "Check Store", url: "#" };

                html += `
                    <div class="saved-item">
                        <div class="item-info">
                            <span class="part-name">${part}</span>
                            <span class="part-price">Best: ${best.store} at <strong>${best.price}</strong></span>
                            <a href="${best.url}" target="_blank" class="watchlist-buy-btn">Buy Now</a>
                        </div>
                        <div class="actions">
                            <button class="delete-btn" data-part="${part}">Remove</button>
                        </div>
                    </div>
                `;
            } catch (err) {
                console.error("Error updating price for:", part);
            }
        }
        savedList.innerHTML = html;

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partName = e.target.getAttribute('data-part');
                watchlist = watchlist.filter(item => item !== partName);
                localStorage.setItem('pcWatchlist', JSON.stringify(watchlist));
                renderWatchlist();
            });
        });
    }

    init();
});