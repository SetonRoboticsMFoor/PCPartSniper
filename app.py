from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Hierarchical data structure
PART_DATA = {
    "CPU": {
        "Intel": ["Core i9-14900K", "Core i7-13700K", "Core i5-12600K"],
        "AMD": ["Ryzen 9 7950X", "Ryzen 7 7800X3D", "Ryzen 5 7600"]
    },
    "GPU": {
        "NVIDIA": ["RTX 4090", "RTX 4080", "RTX 4070 Ti"],
        "AMD": ["RX 7900 XTX", "RX 7800 XT", "RX 6700 XT"]
    },
    "RAM": {
        "Corsair": ["Vengeance LPX 32GB", "Dominator Platinum 64GB"],
        "G.Skill": ["Ripjaws V 16GB", "Trident Z5 RGB 32GB"]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_options')
def get_options():
    category = request.args.get('category')
    brand = request.args.get('brand')
    
    # Tier 1: Get Categories
    if not category:
        return jsonify(list(PART_DATA.keys()))
    
    # Tier 2: Get Brands for a Category
    if category and not brand:
        brands = list(PART_DATA.get(category, {}).keys())
        return jsonify(brands)
    
    # Tier 3: Get Models for a Brand
    if category and brand:
        models = PART_DATA.get(category, {}).get(brand, [])
        return jsonify(models)
    
    return jsonify([])

@app.route('/prices')
def get_prices():
    part_name = request.args.get('part')
    # Mock price data - Replace with your scraper logic later
    prices = [
        {"store": "Amazon", "price": "$124.99"},
        {"store": "Newegg", "price": "$119.50"},
        {"store": "Best Buy", "price": "$129.99"}
    ]
    return jsonify(prices)

if __name__ == '__main__':
    app.run(debug=True)