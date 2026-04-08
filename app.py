from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Mock data for demonstration
PC_PARTS = ["Corsair Vengeance LPX 32GB PC3200", "G.Skill Ripjaws V 32GB PC3200", "Crucial Ballistix 32GB PC3200"]

@app.route('/')
def index():
    # Looks in the /templates folder
    return render_template('index.html')

@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    results = [part for part in PC_PARTS if query in part.lower()]
    return jsonify({"results": results})

@app.route('/prices')
def get_prices():
    part_name = request.args.get('part')
    # Example mock data - In reality, you'd trigger your scraper here
    prices = [
        {"store": "Amazon", "price": "$84.99"},
        {"store": "Newegg", "price": "$82.50"},
        {"store": "Best Buy", "price": "$89.99"}
    ]
    return jsonify(prices)

if __name__ == '__main__':
    app.run(debug=True)