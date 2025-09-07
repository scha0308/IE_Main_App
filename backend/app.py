from flask import Flask, request, jsonify
from flask_cors import CORS
from identify import identify_product
from werkzeug.utils import secure_filename
import os, traceback
from uuid import uuid4

app = Flask(__name__)

frontend_env = os.getenv("FRONTEND_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in frontend_env.split(",") if o.strip()] or [
    "http://localhost:3000",
]

@app.route("/")
def index():
    return "OK", 200
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(status="ok"), 200

CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/api/echo", methods=["GET", "POST", "OPTIONS"])
def echo():
    return jsonify({
        "method": request.method,
        "path": request.path,
        "host": request.headers.get("Host"),
        "origin_header": request.headers.get("Origin"),
    }), 200

@app.route('/api/identify', methods=['POST', 'OPTIONS'])
def identify():
    if request.method == 'OPTIONS':
        return '', 200
    
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']
    if image.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    
    file_name = secure_filename(image.filename) or 'upload.jpg'
    filename = f'{uuid4().hex}_{file_name}'
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(filepath)
    
    try:
        product_name, eco_score = identify_product(filepath)
        return jsonify({
            "product": product_name,
            "score": eco_score
        }), 200
    except Exception as e:
        print(f'[ERROR] identify() failed:\n{traceback.format_exc()}')
        return jsonify({'error': str(e)}), 500

application = app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)