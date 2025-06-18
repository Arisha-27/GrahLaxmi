import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Load CSVs
goal_df = pd.read_csv('goal1.csv')
user_df = pd.read_csv("goal2.csv")

# Merge and clean
merged = pd.merge(goal_df, user_df, on='id')

# Fix duplicate/ambiguous columns
merged.rename(columns={
    'income_x': 'income',
    'income_y': 'income',
    'digital_payment_usage': 'digital_payment'  # just in case
}, inplace=True)

merged.drop(columns=['id'], inplace=True)
merged = merged.loc[:, ~merged.columns.duplicated()]  # drop duplicate columns

# Separate features and target
X = merged.drop("recommended_monthly_saving", axis=1)
y = merged["recommended_monthly_saving"]

# Identify categorical columns
categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()

# Create pipeline
preprocessor = ColumnTransformer([
    ("onehot", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
], remainder="passthrough")

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])

# Train the model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

# Save the pipeline
joblib.dump(pipeline, "saving_predictor.pkl")
print("✅ Model trained and saved as saving_predictor.pkl")
