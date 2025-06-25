import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
df = pd.read_csv("data/Gov_Scheme - a.csv")
df.columns = df.columns.str.strip().str.replace(" ", "_")
df = df.dropna(subset=["Scheme_Name"])

for col in df.columns:
    if df[col].dtype == object:
        df[col] = df[col].fillna("Unknown")
    else:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

categorical_cols = df.select_dtypes(include="object").columns.drop("Scheme_Name")
numeric_cols = df.select_dtypes(include="number").columns

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
        ('num', 'passthrough', numeric_cols)
    ]
)

scheme_features = preprocessor.fit_transform(df.drop(columns=["Scheme_Name"]))
scheme_names = df["Scheme_Name"].values

def recommend_schemes(user_input_dict, top_n=5):
    user_df = pd.DataFrame([user_input_dict])
    user_df.columns = user_df.columns.str.strip().str.replace(" ", "_")

    for col in user_df.columns:
        if user_df[col].dtype == object or user_df[col].dtype.name == 'category':
            user_df[col] = user_df[col].fillna("Unknown")
        else:
            user_df[col] = pd.to_numeric(user_df[col], errors="coerce").fillna(0)

    user_vector = preprocessor.transform(user_df)
    sims = cosine_similarity(user_vector, scheme_features)
    top_indices = np.argsort(sims[0])[::-1][:top_n]
    return scheme_names[top_indices].tolist()
