# train_model.py — Dynamic version without hardcoded paths

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# -----------------------------------------------------
# Configuration (Dynamic Instead of Hardcoded)
# -----------------------------------------------------

DATASET_PATH = os.getenv("DATASET_PATH", "./career_dataset.csv")
MODEL_PATH = os.getenv("MODEL_PATH", "./career_model.pkl")
LABEL_ENCODER_PATH = os.getenv("LABEL_ENCODER_PATH", "./label_encoder.pkl")
SKILL_VECTORIZER_PATH = os.getenv("SKILL_VECTORIZER_PATH", "./skill_vectorizer.pkl")
INTEREST_VECTORIZER_PATH = os.getenv("INTEREST_VECTORIZER_PATH", "./interest_vectorizer.pkl")
EDUCATION_MAP_PATH = os.getenv("EDUCATION_MAP_PATH", "./education_map.pkl")

# Model hyperparameters (configurable)
N_ESTIMATORS = int(os.getenv("N_ESTIMATORS", "200"))
LEARNING_RATE = float(os.getenv("LEARNING_RATE", "0.1"))
MAX_DEPTH = int(os.getenv("MAX_DEPTH", "5"))
TEST_SIZE = float(os.getenv("TEST_SIZE", "0.2"))

# TF-IDF vectorizer configuration
SKILL_FEATURES = int(os.getenv("SKILL_FEATURES", "100"))
INTEREST_FEATURES = int(os.getenv("INTEREST_FEATURES", "50"))

# -----------------------------------------------------
# Training Function
# -----------------------------------------------------

def train_model():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")

    print(f"📘 Loading dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)

    # Validate columns
    required_columns = {"education", "skills", "interests", "career"}
    missing = required_columns - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in dataset: {missing}")

    print("🔧 Encoding education levels...")
    education_map = {"High School": 0, "Bachelor": 1, "Master": 2, "PhD": 3}
    df["education_encoded"] = df["education"].map(education_map)

    print("🎯 Preparing features...")
    skill_vectorizer = TfidfVectorizer(max_features=SKILL_FEATURES)
    interest_vectorizer = TfidfVectorizer(max_features=INTEREST_FEATURES)

    skill_tfidf = skill_vectorizer.fit_transform(df["skills"].astype(str)).toarray()
    interest_tfidf = interest_vectorizer.fit_transform(df["interests"].astype(str)).toarray()

    import numpy as np
    X = np.hstack([df["education_encoded"].values.reshape(-1, 1), skill_tfidf, interest_tfidf])
    y = df["career"].astype(str)

    print("🔢 Encoding target labels...")
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=TEST_SIZE, random_state=42)

    print("🚀 Training Gradient Boosting model...")
    model = GradientBoostingClassifier(
        n_estimators=N_ESTIMATORS,
        learning_rate=LEARNING_RATE,
        max_depth=MAX_DEPTH
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model trained successfully! Accuracy: {accuracy * 100:.2f}%")

    print("💾 Saving model artifacts...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(label_encoder, LABEL_ENCODER_PATH)
    joblib.dump(skill_vectorizer, SKILL_VECTORIZER_PATH)
    joblib.dump(interest_vectorizer, INTEREST_VECTORIZER_PATH)
    joblib.dump(education_map, EDUCATION_MAP_PATH)

    print("📦 Saved files:")
    print(f" - Model: {MODEL_PATH}")
    print(f" - Label Encoder: {LABEL_ENCODER_PATH}")
    print(f" - Skill Vectorizer: {SKILL_VECTORIZER_PATH}")
    print(f" - Interest Vectorizer: {INTEREST_VECTORIZER_PATH}")
    print(f" - Education Map: {EDUCATION_MAP_PATH}")

    return accuracy


if __name__ == "__main__":
    try:
        accuracy = train_model()
        print(f"\n🎉 Training completed successfully with accuracy: {accuracy * 100:.2f}%")
    except Exception as e:
        print(f"❌ Training failed: {str(e)}")
