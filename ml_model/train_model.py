# import pandas as pd
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
# import joblib

# # Load CSVs
# goal_df = pd.read_csv('goal1.csv')
# user_df = pd.read_csv("goal2.csv")

# # Merge and clean
# merged = pd.merge(goal_df, user_df, on='id')

# # Fix duplicate/ambiguous columns
# merged.rename(columns={
#     'income_x': 'income',
#     'income_y': 'income',
#     'digital_payment_usage': 'digital_payment'  # just in case
# }, inplace=True)

# merged.drop(columns=['id'], inplace=True)
# merged = merged.loc[:, ~merged.columns.duplicated()]  # drop duplicate columns

# # Separate features and target
# X = merged.drop("recommended_monthly_saving", axis=1)
# y = merged["recommended_monthly_saving"]

# # Identify categorical columns
# categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()

# # Create pipeline
# preprocessor = ColumnTransformer([
#     ("onehot", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
# ], remainder="passthrough")

# pipeline = Pipeline([
#     ("preprocessor", preprocessor),
#     ("model", RandomForestRegressor(n_estimators=100, random_state=42))
# ])

# # Train the model
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# pipeline.fit(X_train, y_train)

# # Save the pipeline
# joblib.dump(pipeline, "saving_predictor.pkl")
# print("✅ Model trained and saved as saving_predictor.pkl")




import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error
import joblib

# Load data
goal_df = pd.read_csv("goal1.csv")
user_df = pd.read_csv("goal2.csv")

# Merge and clean
merged = pd.merge(goal_df, user_df, on="id")
merged.rename(columns={
    'income_x': 'income',
    'income_y': 'income'
}, inplace=True)
merged.drop(columns=['id'], inplace=True)
merged = merged.loc[:, ~merged.columns.duplicated()]
merged.drop_duplicates(inplace=True)

#  Drop unwanted features from goal2.csv
columns_to_exclude = ['location_type', 'digital_payment_usage', 'shg_membership']
merged.drop(columns=columns_to_exclude, inplace=True, errors='ignore')

# Handle missing values
merged.fillna(method='ffill', inplace=True)

# Split features and target
X = merged.drop("recommended_monthly_saving", axis=1)
y = merged["recommended_monthly_saving"]

# Identify column types
categorical_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
numeric_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

# Convert to 'category' for memory efficiency
for col in categorical_cols:
    X[col] = X[col].astype("category")

# Transformers
numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# Column transformer
preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numeric_cols),
    ('cat', categorical_transformer, categorical_cols)
])

# Model pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(random_state=42, n_jobs=-1))
])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter tuning
param_grid = {
    'model__n_estimators': [100, 200, 300],
    'model__max_depth': [None, 10, 20, 30],
    'model__min_samples_split': [2, 5, 10],
    'model__min_samples_leaf': [1, 2, 4]
}

search = RandomizedSearchCV(
    pipeline,
    param_distributions=param_grid,
    n_iter=10,
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    cv=3,
    verbose=1,
    random_state=42
)

# Train
search.fit(X_train, y_train)
best_model = search.best_estimator_
y_pred = best_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)

print(f"✅ Optimized model trained with MSE: {mse:.2f}")
joblib.dump(best_model, "saving_predictor_optimized.pkl")
print("✅ Model saved as saving_predictor_optimized.pkl")


