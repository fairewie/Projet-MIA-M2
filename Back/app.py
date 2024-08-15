from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
import cv2
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000 

# Charger le modèle
model = load_model('../IA/detecPc.h5')

listepartie = ['cables', 'case', 'cpu', 'gpu', 'hdd', 'headset', 'keyboard', 'microphone', 'monitor', 'motherboard', 'mouse', 'ram', 'speakers', 'webcam']
@app.route('/')
def index():
    print('connexion')
    return jsonify({'message': 'Hello World!'})

@app.route('/predict', methods=['POST'])
def predict():
    print('prediction')
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)

    try:
        img_array = np.frombuffer(file.read(), np.uint8)  # Remplacement de fromstring par frombuffer
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({'error': 'Invalid image or unsupported image format'}), 400

    if img is None:
        return jsonify({'error': 'The image could not be processed'}), 400

    try:
        img = cv2.resize(img, (256, 256)) / 255.0
        img = np.expand_dims(img, axis=0)
    except Exception as e:
        return jsonify({'error': 'Error processing the image'}), 500

    try:
        prediction = model.predict(img)
        predicted_class = np.argmax(prediction)
        predicted_class = int(predicted_class)  # Conversion en int Python standard
    except Exception as e:
        return jsonify({'error': 'Error making prediction'}), 500

    return jsonify({'predicted_class': listepartie[predicted_class]})

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'error': 'Route de fin'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
