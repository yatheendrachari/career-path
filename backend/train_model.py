"""
Career Path Prediction Model Training Script
=============================================
This script trains a machine learning model to predict career paths based on:
- Education level
- Skills (comma-separated)
- Interests (comma-separated)
- Certifications count

The model uses:
- TF-IDF vectorization for skills and interests
- Label encoding for education levels
- Random Forest Classifier for prediction
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os
from pathlib import Path

# Configuration
DATASET_PATH = "./data/career_dataset.csv"
MODELS_DIR = "./models"
RANDOM_STATE = 42
TEST_SIZE = 0.2

# Create models directory if it doesn't exist
os.makedirs(MODELS_DIR, exist_ok=True)

def load_and_preprocess_data():
    """Load and preprocess the career dataset."""
    print("=" * 60)
    print("Loading and Preprocessing Data")
    print("=" * 60)
    
    # Load dataset
    df = pd.read_csv(DATASET_PATH)
    print(f"\nDataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"\nColumns: {list(df.columns)}")
    print(f"\nFirst few rows:")
    print(df.head())
    
    # Check for missing values
    print(f"\nMissing values:")
    print(df.isnull().sum())
    
    # Display career distribution
    print(f"\nCareer distribution:")
    print(df['career'].value_counts())
    
    return df

def extract_features(df):
    """Extract and preprocess features from the dataset."""
    print("\n" + "=" * 60)
    print("Feature Extraction")
    print("=" * 60)
    
    # Prepare skills and interests as strings (they're already comma-separated)
    skills_text = df['skills'].astype(str)
    interests_text = df['interests'].astype(str)
    
    # Encode education levels
    education_map = {
        'High School': 0,
        'Bachelor': 1,
        'Master': 2,
        'PhD': 3
    }
    
    # Handle any education levels not in the map
    df['education_encoded'] = df['education'].map(education_map)
    
    # Fill any NaN values (if education level not in map) with median
    if df['education_encoded'].isnull().any():
        median_edu = df['education_encoded'].median()
        df['education_encoded'] = df['education_encoded'].fillna(median_edu)
        print(f"Warning: Some education levels not in map. Filled with median: {median_edu}")
    
    # Certifications count (already numeric)
    certifications = df['certifications_count'].values
    
    # Vectorize skills using TF-IDF
    print("\nVectorizing skills...")
    skill_vectorizer = TfidfVectorizer(
        max_features=100,  # Limit features to avoid overfitting
        ngram_range=(1, 2),  # Include unigrams and bigrams
        min_df=2,  # Minimum document frequency
        stop_words='english'
    )
    skills_vectors = skill_vectorizer.fit_transform(skills_text)
    print(f"Skills vector shape: {skills_vectors.shape}")
    
    # Vectorize interests using TF-IDF
    print("\nVectorizing interests...")
    interest_vectorizer = TfidfVectorizer(
        max_features=50,  # Fewer features for interests
        ngram_range=(1, 2),
        min_df=2,
        stop_words='english'
    )
    interests_vectors = interest_vectorizer.fit_transform(interests_text)
    print(f"Interests vector shape: {interests_vectors.shape}")
    
    # Combine all features
    print("\nCombining features...")
    education_array = df['education_encoded'].values.reshape(-1, 1)
    certifications_array = certifications.reshape(-1, 1)
    
    # Convert sparse matrices to arrays and combine
    from scipy.sparse import hstack
    X = hstack([
        education_array,
        certifications_array,
        skills_vectors,
        interests_vectors
    ]).toarray()
    
    print(f"Final feature matrix shape: {X.shape}")
    
    # Encode target labels (careers)
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(df['career'])
    
    print(f"\nTarget classes: {label_encoder.classes_}")
    print(f"Target encoded shape: {y.shape}")
    
    return X, y, skill_vectorizer, interest_vectorizer, label_encoder, education_map

def train_model(X, y, label_encoder):
    """Train the Random Forest model."""
    print("\n" + "=" * 60)
    print("Model Training")
    print("=" * 60)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    
    print(f"\nTraining set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # Train Random Forest Classifier
    print("\nTraining Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        class_weight='balanced'  # Handle class imbalance if any
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    print("\nEvaluating model...")
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    train_accuracy = accuracy_score(y_train, y_train_pred)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    
    print(f"\nTraining Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
    print(f"Test Accuracy: {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_test_pred, target_names=label_encoder.classes_))
    
    # Confusion matrix
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_test_pred)
    print(cm)
    
    return model, X_test, y_test

def save_artifacts(model, skill_vectorizer, interest_vectorizer, label_encoder, education_map):
    """Save the trained model and preprocessing artifacts."""
    print("\n" + "=" * 60)
    print("Saving Model Artifacts")
    print("=" * 60)
    
    # Save model
    model_path = os.path.join(MODELS_DIR, "career_model.pkl")
    joblib.dump(model, model_path)
    print(f"[OK] Model saved to: {model_path}")
    
    # Save label encoder
    label_encoder_path = os.path.join(MODELS_DIR, "label_encoder.pkl")
    joblib.dump(label_encoder, label_encoder_path)
    print(f"[OK] Label encoder saved to: {label_encoder_path}")
    
    # Save skill vectorizer
    skill_vectorizer_path = os.path.join(MODELS_DIR, "skill_vectorizer.pkl")
    joblib.dump(skill_vectorizer, skill_vectorizer_path)
    print(f"[OK] Skill vectorizer saved to: {skill_vectorizer_path}")
    
    # Save interest vectorizer
    interest_vectorizer_path = os.path.join(MODELS_DIR, "interest_vectorizer.pkl")
    joblib.dump(interest_vectorizer, interest_vectorizer_path)
    print(f"[OK] Interest vectorizer saved to: {interest_vectorizer_path}")
    
    # Save education map
    education_map_path = os.path.join(MODELS_DIR, "education_map.pkl")
    joblib.dump(education_map, education_map_path)
    print(f"[OK] Education map saved to: {education_map_path}")
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)

def main():
    """Main training pipeline."""
    try:
        # Load and preprocess data
        df = load_and_preprocess_data()
        
        # Extract features
        X, y, skill_vectorizer, interest_vectorizer, label_encoder, education_map = extract_features(df)
        
        # Train model
        model, X_test, y_test = train_model(X, y, label_encoder)
        
        # Save artifacts
        save_artifacts(model, skill_vectorizer, interest_vectorizer, label_encoder, education_map)
        
        print("\n[SUCCESS] All artifacts saved successfully!")
        print("\nModel is ready for use in the API.")
        
    except Exception as e:
        print(f"\n[ERROR] Error during training: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    main()

