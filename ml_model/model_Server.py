from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained pipeline
model = joblib.load("saving_predictor.pkl")

@app.route('/', methods=['GET'])
def home():
    return "✅ Flask is running"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("📩 Received:", data)

        input_df = pd.DataFrame([{
            "income": float(data["income"]),
            "goal_type": data["goal_type"],
            "goal_amount": float(data["goal_amount"]),
            "duration_months": float(data["duration_months"]),
            "age": float(data["age"]),
            "location_type": data["location_type"],
            "digital_payment": data["digital_payment"],
            "shg_membership": data["shg_membership"],
            "occupation": data["occupation"]
        }])

        prediction = model.predict(input_df)[0]
        return jsonify({"predicted_saving": round(prediction, 2)})

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)
