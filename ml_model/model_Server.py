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
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import sqlite3
# import pandas as pd
# from datetime import datetime
# import os

# app = Flask(__name__)
# CORS(app)

# # Load the trained ML model
# model = joblib.load("saving_predictor_optimized.pkl")

# # Home Route
# @app.route('/', methods=['GET'])
# def home():
#     return "✅ Flask server is running"

# # Route: Predict savings
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()
#         expected_columns = [
#             'income', 'goal_type', 'goal_amount', 'duration_months',
#             'age', 'location_type', 'digital_payment', 'shg_membership', 'occupation'
#         ]
#         input_df = pd.DataFrame([data], columns=expected_columns)
#         prediction = model.predict(input_df)
#         return jsonify({'predicted_saving': round(prediction[0], 2)})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

# # Initialize user if not exists
# @app.route('/create-user', methods=['POST'])
# def init_user():
#     try:
#         data = request.get_json()
#         uid = data.get("uid")
#         name = data.get("name", "User")

#         if not uid:
#             return jsonify({"error": "UID missing"}), 400

#         conn = sqlite3.connect("form_data.db")
#         cursor = conn.cursor()

#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 username TEXT NOT NULL UNIQUE,
#                 display_name TEXT
#             )
#         ''')

#         cursor.execute("SELECT id FROM users WHERE username = ?", (uid,))
#         result = cursor.fetchone()

#         if not result:
#             cursor.execute("INSERT INTO users (username, display_name) VALUES (?, ?)", (uid, name))
#             conn.commit()

#         conn.close()
#         print("✅ Created/Verified user in DB at:", os.path.abspath("form_data.db"))
#         return jsonify({"status": "ok"})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# # Save form data to database
# @app.route('/save', methods=['POST'])
# def save_data():
#     try:
#         data = request.get_json()
#         conn = sqlite3.connect('form_data.db')
#         cursor = conn.cursor()

#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS form_data (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 user_id TEXT,
#                 income REAL,
#                 goal_type TEXT,
#                 goal_amount REAL,
#                 duration_months REAL,
#                 age REAL,
#                 location_type TEXT,
#                 digital_payment TEXT,
#                 shg_membership TEXT,
#                 occupation TEXT,
#                 predicted_saving REAL,
#                 saved_till_now REAL DEFAULT 0,
#                 month TEXT DEFAULT (strftime('%Y-%m', 'now'))
#             )
#         ''')

#         cursor.execute('''
#             INSERT INTO form_data (
#                 user_id, income, goal_type, goal_amount, duration_months, age,
#                 location_type, digital_payment, shg_membership, occupation,
#                 predicted_saving, saved_till_now, month
#             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', (
#             data.get("user_id", "default_user"),
#             float(data["income"]),
#             data["goal_type"],
#             float(data["goal_amount"]),
#             float(data["duration_months"]),
#             float(data["age"]),
#             data["location_type"],
#             data["digital_payment"],
#             data["shg_membership"],
#             data["occupation"],
#             float(data["predicted_saving"]),
#             float(data.get("saved_till_now", 0)),
#             data.get("month", datetime.now().strftime('%Y-%m'))
#         ))

#         conn.commit()
#         conn.close()
#         print("✅ Data saved for user:", data.get("user_id"))
#         return jsonify({"status": "saved"})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# @app.route('/user-data/<user_id>', methods=['GET'])
# def get_user_data(user_id):
#     try:
#         import os
#         print("📍 DB path:", os.path.abspath("form_data.db"))  # optional debug print

#         conn = sqlite3.connect("form_data.db")  # ✅ this line is necessary
#         cursor = conn.cursor()

#         # Get latest form data
#         cursor.execute('''
#             SELECT * FROM form_data
#             WHERE user_id = ?
#             ORDER BY id DESC
#             LIMIT 1
#         ''', (user_id,))
#         form_row = cursor.fetchone()

#         # Get name from users table
#         cursor.execute('SELECT display_name FROM users WHERE username = ?', (user_id,))
#         name_row = cursor.fetchone()
#         name = name_row[0] if name_row else "User"

#         conn.close()

#         if form_row:
#             return jsonify({
#                 "name": name,
#                 "goal_type": form_row[3],
#                 "goal_amount": form_row[4],
#                 "predicted_saving": form_row[11],
#                 "saved_till_now": form_row[12],
#                 "goalProgress": round((form_row[12] / form_row[4]) * 100, 2)
#             })
#         else:
#             return jsonify({"name": name, "error": "No data found"}), 404

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# # Update savings progress
# @app.route('/update-progress', methods=['POST'])
# def update_progress():
#     try:
#         data = request.get_json()
#         user_id = data['user_id']
#         amount = float(data['amount'])

#         conn = sqlite3.connect('form_data.db')
#         cursor = conn.cursor()

#         cursor.execute('''
#             UPDATE form_data
#             SET saved_till_now = saved_till_now + ?
#             WHERE id = (
#                 SELECT id FROM form_data
#                 WHERE user_id = ?
#                 ORDER BY id DESC LIMIT 1
#             )
#         ''', (amount, user_id))

#         conn.commit()
#         conn.close()
#         print("✅ Updated progress for:", user_id)
#         return jsonify({"status": "progress updated"})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# # Run server
# if __name__ == '__main__':
#     print("📂 DB path:", os.path.abspath("form_data.db"))
#     app.run(debug=True)









# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import sqlite3
# import pandas as pd
# from datetime import datetime
# import os

# app = Flask(__name__)
# CORS(app)

# # Load the trained ML model
# model = joblib.load("saving_predictor_optimized.pkl")

# @app.route('/', methods=['GET'])
# def home():
#     return "✅ Flask server is running"

# # Predict savings
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()
#         expected_columns = [
#             'income', 'goal_type', 'goal_amount', 'duration_months',
#             'age', 'occupation'
#         ]
#         missing = [col for col in expected_columns if col not in data]
#         if missing:
#             return jsonify({'error': f'Missing fields: {missing}'}), 400

#         input_df = pd.DataFrame([data], columns=expected_columns)
#         prediction = model.predict(input_df)
#         return jsonify({'predicted_saving': round(prediction[0], 2)})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

# # Create/verify user
# @app.route('/create-user', methods=['POST'])
# def init_user():
#     try:
#         data = request.get_json()
#         uid = data.get("uid")
#         name = data.get("name", "User")

#         if not uid:
#             return jsonify({"error": "UID missing"}), 400

#         conn = sqlite3.connect("form_data.db")
#         cursor = conn.cursor()

#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 username TEXT NOT NULL UNIQUE,
#                 display_name TEXT
#             )
#         ''')

#         cursor.execute("SELECT id FROM users WHERE username = ?", (uid,))
#         result = cursor.fetchone()

#         if not result:
#             cursor.execute("INSERT INTO users (username, display_name) VALUES (?, ?)", (uid, name))
#             conn.commit()

#         conn.close()
#         print("✅ Created/Verified user in DB at:", os.path.abspath("form_data.db"))
#         return jsonify({"status": "ok"})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# # Save form data
# @app.route('/save', methods=['POST'])
# def save_data():
#     try:
#         data = request.get_json()
#         conn = sqlite3.connect('form_data.db')
#         cursor = conn.cursor()

#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS form_data (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 user_id TEXT,
#                 income REAL,
#                 goal_type TEXT,
#                 goal_amount REAL,
#                 duration_months REAL,
#                 age REAL,
#                 occupation TEXT,
#                 predicted_saving REAL,
#                 saved_till_now REAL DEFAULT 0,
#                 month TEXT DEFAULT (strftime('%Y-%m', 'now'))
#             )
#         ''')

#         cursor.execute('''
#             INSERT INTO form_data (
#                 user_id, income, goal_type, goal_amount, duration_months, age,
#                 occupation, predicted_saving, saved_till_now, month
#             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', (
#             data.get("user_id", "default_user"),
#             float(data["income"]),
#             data["goal_type"],
#             float(data["goal_amount"]),
#             float(data["duration_months"]),
#             float(data["age"]),
#             data["occupation"],
#             float(data["predicted_saving"]),
#             float(data.get("saved_till_now", 0)),
#             data.get("month", datetime.now().strftime('%Y-%m'))
#         ))

#         conn.commit()
#         conn.close()
#         print("✅ Data saved for user:", data.get("user_id"))
#         return jsonify({"status": "saved"})

#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

# # Get user form data
# @app.route('/user-data/<user_id>', methods=['GET'])
# def get_user_data(user_id):
#     try:
#         conn = sqlite3.connect("form_data.db")
#         cursor = conn.cursor()

#         cursor.execute('''
#             SELECT * FROM form_data
#             WHERE user_id = ?
#             ORDER BY id DESC
#             LIMIT 1
#         ''', (user_id,))
#         form_row = cursor.fetchone()

#         cursor.execute('SELECT display_name FROM users WHERE username = ?', (user_id,))
#         name_row = cursor.fetchone()
#         name = name_row[0] if name_row else "User"

#         conn.close()

#         if form_row:
#             return jsonify({
#                 "name": name,
#                 "goal_type": form_row[3],
#                 "goal_amount": form_row[4],
#                 "predicted_saving": form_row[8],
#                 "saved_till_now": form_row[9],
#                 "goalProgress": round((form_row[9] / form_row[4]) * 100, 2)
#             })
#         else:
#             return jsonify({"name": name, "error": "No data found"}), 404

#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

# # Update saving progress
# @app.route('/update-progress', methods=['POST'])
# def update_progress():
#     try:
#         data = request.get_json()
#         user_id = data['user_id']
#         amount = float(data['amount'])

#         conn = sqlite3.connect('form_data.db')
#         cursor = conn.cursor()

#         cursor.execute('''
#             UPDATE form_data
#             SET saved_till_now = saved_till_now + ?
#             WHERE id = (
#                 SELECT id FROM form_data
#                 WHERE user_id = ?
#                 ORDER BY id DESC LIMIT 1
#             )
#         ''', (amount, user_id))

#         conn.commit()
#         conn.close()
#         print("✅ Updated progress for:", user_id)
#         return jsonify({"status": "progress updated"})

#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

# # Run the Flask app
# if __name__ == '__main__':
#     print("📂 DB path:", os.path.abspath("form_data.db"))
#     app.run(debug=True)










from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import sqlite3
import pandas as pd
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load the trained ML model
model = joblib.load("saving_predictor_optimized.pkl")

# ✅ Reusable helper to create user if they don't exist
def create_user_if_not_exists(uid, name="User"):
    conn = sqlite3.connect("form_data.db")
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            display_name TEXT
        )
    ''')

    cursor.execute("SELECT id FROM users WHERE username = ?", (uid,))
    result = cursor.fetchone()

    if not result:
        cursor.execute("INSERT INTO users (username, display_name) VALUES (?, ?)", (uid, name))
        conn.commit()

    conn.close()

@app.route('/', methods=['GET'])
def home():
    return "✅ Flask server is running"

# Predict savings
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        expected_columns = [
            'income', 'goal_type', 'goal_amount', 'duration_months',
            'age', 'occupation'
        ]
        missing = [col for col in expected_columns if col not in data]
        if missing:
            return jsonify({'error': f'Missing fields: {missing}'}), 400

        input_df = pd.DataFrame([data], columns=expected_columns)
        prediction = model.predict(input_df)
        return jsonify({'predicted_saving': round(prediction[0], 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Create/verify user
@app.route('/create-user', methods=['POST'])
def init_user():
    try:
        data = request.get_json()
        uid = data.get("uid")
        name = data.get("name", "User")

        if not uid:
            return jsonify({"error": "UID missing"}), 400

        create_user_if_not_exists(uid, name)
        print("✅ Created/Verified user in DB at:", os.path.abspath("form_data.db"))
        return jsonify({"status": "ok"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Save form data
@app.route('/save', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        user_id = data.get("user_id", "default_user")
        user_name = user_id.split("@")[0] if "@" in user_id else "User"

        # ✅ Ensure user is in DB
        create_user_if_not_exists(user_id, user_name)

        conn = sqlite3.connect('form_data.db')
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS form_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                income REAL,
                goal_type TEXT,
                goal_amount REAL,
                duration_months REAL,
                age REAL,
                occupation TEXT,
                predicted_saving REAL,
                saved_till_now REAL DEFAULT 0,
                month TEXT DEFAULT (strftime('%Y-%m', 'now'))
            )
        ''')

        cursor.execute('''
            INSERT INTO form_data (
                user_id, income, goal_type, goal_amount, duration_months, age,
                occupation, predicted_saving, saved_till_now, month
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            float(data["income"]),
            data["goal_type"],
            float(data["goal_amount"]),
            float(data["duration_months"]),
            float(data["age"]),
            data["occupation"],
            float(data["predicted_saving"]),
            float(data.get("saved_till_now", 0)),
            data.get("month", datetime.now().strftime('%Y-%m'))
        ))

        conn.commit()
        conn.close()
        print("✅ Data saved for user:", user_id)
        return jsonify({"status": "saved"})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Get user form data
@app.route('/user-data/<user_id>', methods=['GET'])
def get_user_data(user_id):
    try:
        conn = sqlite3.connect("form_data.db")
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM form_data
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        ''', (user_id,))
        form_row = cursor.fetchone()

        cursor.execute('SELECT display_name FROM users WHERE username = ?', (user_id,))
        name_row = cursor.fetchone()
        name = name_row[0] if name_row else "User"

        conn.close()

        if form_row:
            return jsonify({
                "name": name,
                "goal_type": form_row[3],
                "goal_amount": form_row[4],
                "predicted_saving": form_row[8],
                "saved_till_now": form_row[9],
                "goalProgress": round((form_row[9] / form_row[4]) * 100, 2)
            })
        else:
            return jsonify({"name": name, "error": "No data found"}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Update saving progress
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
        print("✅ Updated progress for:", user_id)
        return jsonify({"status": "progress updated"})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Run the Flask app
if __name__ == '__main__':
    print("📂 DB path:", os.path.abspath("form_data.db"))
    app.run(debug=True)
