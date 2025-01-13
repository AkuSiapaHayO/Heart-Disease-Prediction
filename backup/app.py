from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load all scalers and models
with open('models/angina_scaler.pkl', 'rb') as f:
    angina_scaler = pickle.load(f)

with open('models/angina_model.pkl', 'rb') as f:
    angina_model = pickle.load(f)

with open('models/heart_attack_scaler.pkl', 'rb') as f:
    heartattack_scaler = pickle.load(f)

with open('models/heart_attack_model.pkl', 'rb') as f:
    heartattack_model = pickle.load(f)

with open('models/stroke_scaler.pkl', 'rb') as f:
    stroke_scaler = pickle.load(f)

with open('models/stroke_model.pkl', 'rb') as f:
    stroke_model = pickle.load(f)

# Without
with open('models/heart_attack_model_without.pkl', 'rb') as f:
    heartattack_model_without = pickle.load(f)

with open('models/stroke_model_without.pkl', 'rb') as f:
    stroke_model_without = pickle.load(f)

# Map models and scalers to their respective endpoints
models = {
    'angina': (angina_model, angina_scaler),
    'heartattack': (heartattack_model, heartattack_scaler),
    'stroke': (stroke_model, stroke_scaler),
    'heartattack-without': (heartattack_model_without, heartattack_scaler),
    'stroke-without': (stroke_model_without, stroke_scaler)
}

@app.route('/predict/<model_type>', methods=['POST'])
def predict(model_type):
    # Check if the requested model type exists
    if model_type not in models:
        return jsonify({'error': f"Model '{model_type}' not found"}), 400
    
    # Load the appropriate model and scaler
    model, scaler = models[model_type]
    
    # Get data from the request
    data = request.json
    input_data = np.array(data['input']).reshape(1, -1)  # Ensure input is 2D
    
    try:
        # Preprocess the input data
        scaled_data = scaler.transform(input_data)
        
        # Predict probabilities
        probabilities = model.predict_proba(scaled_data)[0]

        # Probability of positive class (Class 1)
        positive_probability = probabilities[1] * 100
       
        # Print response for debugging
        print(f"Response: {{'probability': '{positive_probability:.2f}%'}}")

        return jsonify({'probability': f"{positive_probability:.2f}%"})
    except Exception as e:
        # Handle errors gracefully
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)