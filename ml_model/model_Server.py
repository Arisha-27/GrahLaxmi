# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd

# app = Flask(__name__)

# # Load the trained pipeline
# model = joblib.load("saving_predictor.pkl")

# @app.route('/', methods=['GET'])
# def home():
#     return "✅ Flask is running"

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()
#         print("📩 Received:", data)

#         input_df = pd.DataFrame([{
#             "income": float(data["income"]),
#             "goal_type": data["goal_type"],
#             "goal_amount": float(data["goal_amount"]),
#             "duration_months": float(data["duration_months"]),
#             "age": float(data["age"]),
#             "location_type": data["location_type"],
#             "digital_payment": data["digital_payment"],
#             "shg_membership": data["shg_membership"],
#             "occupation": data["occupation"]
#         }])

#         prediction = model.predict(input_df)[0]
#         return jsonify({"predicted_saving": round(prediction, 2)})

#     except Exception as e:
#         print("❌ Error:", e)
#         return jsonify({"error": str(e)}), 400

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import sqlite3
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load the trained ML model
model = joblib.load("saving_predictor.pkl")

# Home Route
@app.route('/', methods=['GET'])
def home():
    return "✅ Flask server is running"

# Route: Predict savings
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Expected columns in correct order
        expected_columns = [
            'income',
            'goal_type',
            'goal_amount',
            'duration_months',
            'age',
            'location_type',
            'digital_payment',
            'shg_membership',
            'occupation'
        ]

        # Create DataFrame
        input_df = pd.DataFrame([data], columns=expected_columns)

        # Predict
        prediction = model.predict(input_df)
        return jsonify({'predicted_saving': round(prediction[0], 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route: Save form data to database
@app.route('/save', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        conn = sqlite3.connect('form_data.db')
        cursor = conn.cursor()

        # Create table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS form_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                income REAL,
                goal_type TEXT,
                goal_amount REAL,
                duration_months REAL,
                age REAL,
                location_type TEXT,
                digital_payment TEXT,
                shg_membership TEXT,
                occupation TEXT,
                predicted_saving REAL,
                saved_till_now REAL DEFAULT 0,
                month TEXT DEFAULT (strftime('%Y-%m', 'now'))
            )
        ''')

        # Insert user data
        cursor.execute('''
            INSERT INTO form_data (
                user_id, income, goal_type, goal_amount, duration_months, age,
                location_type, digital_payment, shg_membership, occupation,
                predicted_saving, saved_till_now, month
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get("user_id", "default_user"),
            float(data["income"]),
            data["goal_type"],
            float(data["goal_amount"]),
            float(data["duration_months"]),
            float(data["age"]),
            data["location_type"],
            data["digital_payment"],
            data["shg_membership"],
            data["occupation"],
            float(data["predicted_saving"]),
            float(data.get("saved_till_now", 0)),
            data.get("month", datetime.now().strftime('%Y-%m'))
        ))

        conn.commit()
        conn.close()
        return jsonify({"status": "saved"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route: Get latest user data for dashboard
@app.route('/user-data/<user_id>', methods=['GET'])
def get_user_data(user_id):
    try:
        conn = sqlite3.connect('form_data.db')
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM form_data
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        ''', (user_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return jsonify({
                "goal_type": row[3],
                "goal_amount": row[4],
                "predicted_saving": row[11],
                "saved_till_now": row[12],
                "goalProgress": round((row[12] / row[4]) * 100, 2)
            })
        else:
            return jsonify({"error": "No data found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route: Update savings progress
@app.route('/update-progress', methods=['POST'])
def update_progress():
    try:
        data = request.get_json()
        user_id = data['user_id']
        amount = float(data['amount'])

        conn = sqlite3.connect('form_data.db')
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE form_data
            SET saved_till_now = saved_till_now + ?
            WHERE id = (
                SELECT id FROM form_data
                WHERE user_id = ?
                ORDER BY id DESC LIMIT 1
            )
        ''', (amount, user_id))

        conn.commit()
        conn.close()
        return jsonify({"status": "progress updated"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run Flask server
if __name__ == '__main__':
    app.run(debug=True)
