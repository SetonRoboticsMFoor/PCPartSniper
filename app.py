from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Expanded hierarchical data structure
PART_DATA = {
    "CPU": {
        "Intel": ["Core i9-14900K", "Core i7-13700K", "Core i5-13600K", "Core i3-12100"],
        "AMD": ["Ryzen 9 7950X3D", "Ryzen 7 7800X3D", "Ryzen 5 7600", "Ryzen 5 5600G"]
    },
    "GPU": {
        "NVIDIA": ["RTX 4090", "RTX 4080 Super", "RTX 4070", "RTX 4060 Ti", "RTX 3060"],
        "AMD": ["RX 7900 XTX", "RX 7800 XT", "RX 7600", "RX 6700 XT"],
        "Intel": ["Arc A770", "Arc A750"]
    },
    "RAM": {
        "Corsair": ["Vengeance LPX 32GB", "Dominator Titanium 64GB", "Vengeance RGB 16GB"],
        "G.Skill": ["Trident Z5 Neo 32GB", "Ripjaws S5 32GB", "Flare X5 16GB"],
        "Crucial": ["Pro DDR5 32GB", "Classic DDR4 16GB"]
    },
    "SSD": {
        "Samsung": ["990 Pro 2TB", "970 Evo Plus 1TB", "870 EVO 500GB"],
        "Western Digital": ["WD Black SN850X", "WD Blue SN580"],
        "Crucial": ["T700 Gen5", "P3 Plus 2TB"]
    },
    "PSU": {
        "EVGA": ["SuperNOVA 850G", "600 W1 White"],
        "Corsair": ["RM850x Gold", "SF750 Platinum", "CX750M"],
        "Seasonic": ["Focus GX-1000", "Prime TX-1300"]
    },
    "Case": {
        "NZXT": ["H7 Flow", "H5 Elite", "H9 Flow"],
        "Lian Li": ["PC-O11 Dynamic", "Lancool 216"],
        "Fractal Design": ["North", "Meshify 2 Compact", "Terra"]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_options')
def get_options():
    category = request.args.get('category')
    brand = request.args.get('brand')
    
    if not category:
        return jsonify(list(PART_DATA.keys()))
    
    if category and not brand:
        brands = list(PART_DATA.get(category, {}).keys())
        return jsonify(brands)
    
    if category and brand:
        models = PART_DATA.get(category, {}).get(brand, [])
        return jsonify(models)
    
    return jsonify([])

@app.route('/prices')
def get_prices():
    part_name = request.args.get('part')
    # Mock price data - replace with your scraper later
    prices = [
        {"store": "Amazon", "price": "$124.99"},
        {"store": "Newegg", "price": "$119.50"},
        {"store": "Best Buy", "price": "$129.99"}
    ]
    return jsonify(prices)

if __name__ == '__main__':
    app.run(debug=True)