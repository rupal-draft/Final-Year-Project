from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

cors_origin = os.getenv("FLASK_CORS_ORIGIN", "*")

app = Flask(__name__)
CORS(app, origins=[cors_origin], methods=["GET", "POST", "OPTIONS"])

@app.route('/api/detect-protein', methods=['POST'])
def detect_protein():
    data = request.json
    sequence = data.get('sequence')
    result = f"Processed sequence: {sequence}"
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
