from fastapi import FastAPI
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI()

# -----------------------------
# STEP 1: Training Data (Dummy)
# -----------------------------
# Features = [requests, failed_logins, transaction_amount]
X_train = np.array([
    [20, 1, 200],
    [25, 1, 180],
    [30, 2, 220],
    [22, 1, 210],
    [27, 2, 190],
    [24, 1, 205],
    [28, 2, 195]
])

# -----------------------------
# STEP 2: Train Model
# -----------------------------
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(X_train)

# -----------------------------
# STEP 3: API Endpoint
# -----------------------------
@app.post("/analyze")
def analyze(data: dict):
    """
    Expected input:
    {
        "requests": number,
        "failed_logins": number,
        "amount": number
    }
    """

    try:
        X = np.array([[
            data["requests"],
            data["failed_logins"],
            data["amount"]
        ]])

        prediction = model.predict(X)   # -1 = anomaly, 1 = normal
        score = model.decision_function(X)

        return {
            "anomaly": int(prediction[0] == -1),
            "score": float(score[0])
        }

    except Exception as e:
        return {
            "error": str(e)
        }