import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load and preprocess dataset
df = pd.read_csv("data/Gov_Scheme/a.csv", on_bad_lines='skip')
df.columns = df.columns.str.strip().str.replace(" ", "_")
df = df.dropna(subset=["Scheme_Name"])
df.fillna(0, inplace=True)

# Identify numeric columns for similarity
feature_cols = [col for col in df.columns if df[col].dtype in [np.int64, np.float64]]

def recommend_schemes(user_input: dict, top_n=1):
    # Prepare user data as single row DataFrame
    user_df = pd.DataFrame([user_input])

    # Ensure all required columns are present
    for col in feature_cols:
        if col not in user_df:
            user_df[col] = 0  # default if not provided

    # Compute cosine similarity
    user_vector = user_df[feature_cols]
    scheme_features = df[feature_cols]

    similarities = cosine_similarity(scheme_features, user_vector)
    top_indices = similarities[:, 0].argsort()[::-1][:top_n]

    return df.iloc[top_indices]["Scheme_Name"].tolist()

