# import sqlite3

# conn = sqlite3.connect("form_data.db")
# cursor = conn.cursor()

# cursor.execute('''
# CREATE TABLE IF NOT EXISTS users (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     username TEXT NOT NULL UNIQUE
# )
# ''')

# cursor.execute('''
# CREATE TABLE IF NOT EXISTS form_data (
#   id INTEGER PRIMARY KEY AUTOINCREMENT,
#   user_id TEXT,
#   income REAL,
#   goal_type TEXT,
#   goal_amount REAL,
#   duration_months REAL,
#   age REAL,
#   location_type TEXT,
#   digital_payment TEXT,
#   shg_membership TEXT,
#   occupation TEXT,
#   predicted_saving REAL,
#   saved_till_now REAL DEFAULT 0,
#   month TEXT DEFAULT (strftime('%Y-%m', 'now'))
# );

# ''')

# conn.commit()
# conn.close()





import sqlite3

conn = sqlite3.connect("form_data.db")
cursor = conn.cursor()

# Create users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT
)
''')

# Create form_data table (clean version)
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

conn.commit()
conn.close()
print("✅ Database initialized with cleaned schema.")

