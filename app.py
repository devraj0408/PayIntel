from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import joblib
import numpy as np
import os
from urllib.parse import urlparse, parse_qs

# -----------------------------
# Quantum (Safe Import)
# -----------------------------
try:
    from qiskit import QuantumCircuit
    from qiskit_aer import AerSimulator
    quantum_available = True
except:
    quantum_available = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Model Loader
# -----------------------------
MODEL_TYPE = os.getenv("MODEL_TYPE", "cmd")

if MODEL_TYPE == "jupyter":
    model_path = "models/fraud_model_jupyter.pkl"
else:
    model_path = "models/fraud_model_cmd.pkl"

try:
    model = joblib.load(model_path)
    print(f"✅ Model loaded: {model_path}")
except Exception as e:
    print("❌ Model load failed:", e)
    model = None


# -----------------------------
# Fraud Intelligence Memory
# -----------------------------
BLACKLISTED_UPI = {
    "fraud@upi",
    "scammer@paytm",
    "fake@okbank"
}

UPI_REPORTS = {
    "fraud@upi": 12,
    "scammer@paytm": 8,
    "fake@okbank": 5
}


# -----------------------------
# Helpers
# -----------------------------
def extract_upi(link):
    parsed = urlparse(link)
    params = parse_qs(parsed.query)
    return params.get("pa", ["unknown"])[0]


def extract_amount(link):
    parsed = urlparse(link)
    params = parse_qs(parsed.query)
    return float(params.get("am", [0])[0])


# -----------------------------
# Behavior Risk
# -----------------------------
def behavior_risk(upi_id):
    if upi_id in BLACKLISTED_UPI:
        return 0.9
    return min(UPI_REPORTS.get(upi_id, 0) / 10, 0.8)


# -----------------------------
# Risk Level
# -----------------------------
def risk_level(score):
    if score < 0.3:
        return "LOW"
    elif score < 0.6:
        return "MEDIUM"
    else:
        return "HIGH"


# -----------------------------
# Quantum Risk
# -----------------------------
def quantum_risk_score(classical_risk):

    if not quantum_available:
        return classical_risk * 0.85

    try:
        qc = QuantumCircuit(1, 1)
        qc.ry(classical_risk * np.pi, 0)
        qc.measure(0, 0)

        simulator = AerSimulator()
        result = simulator.run(qc, shots=1000).result()
        counts = result.get_counts()

        return counts.get("1", 0) / 1000

    except:
        return classical_risk * 0.85


# -----------------------------
# Core Fraud Detection
# -----------------------------
def fraud_detection(transaction):

    features = [[
        transaction["amount"],
        transaction["time_of_day"],
        transaction["receiver_age_days"],
        transaction["receiver_report_count"],
        transaction["location_risk"],
        transaction["device_trust_score"]
    ]]

    if model:
        ml_prob = model.predict_proba(features)[0][1]
    else:
        ml_prob = 0.8 if transaction["amount"] > 3000 else 0.2

    quantum_prob = quantum_risk_score(ml_prob)
    behavior = behavior_risk(transaction["upi_id"])

    final_score = (ml_prob * 0.5) + (quantum_prob * 0.2) + (behavior * 0.3)

    reasons = []

    if transaction["receiver_report_count"] > 5:
        reasons.append("Receiver reported multiple times")

    if transaction["receiver_age_days"] < 10:
        reasons.append("New account")

    if transaction["amount"] > 5000:
        reasons.append("High transaction amount")

    if behavior > 0.7:
        reasons.append("UPI flagged in fraud intelligence")

    if final_score < 0.4:
        decision = "SAFE"
    elif final_score < 0.7:
        decision = "WARNING"
    else:
        decision = "FRAUD"

    return {
        "ml_risk": float(ml_prob),
        "quantum_risk": float(quantum_prob),
        "behavior_risk": float(behavior),
        "risk_score": float(final_score),
        "risk_level": risk_level(final_score),
        "decision": decision,
        "reasons": reasons
    }


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def home():
    return {"message": "PayIntel Fraud Detection API running"}


@app.get("/fraud_stats")
def fraud_stats():
    return {
        "total_transactions": 1240,
        "fraud_detected": 87,
        "warnings": 210,
        "safe_payments": 943
    }


@app.get("/flagged_upi")
def flagged_upi():
    return [
        {"upi_id": upi, "reports": UPI_REPORTS.get(upi, 0)}
        for upi in BLACKLISTED_UPI
    ]


@app.get("/risk_heatmap")
def risk_heatmap():
    return [
        {"region": "Delhi", "risk_level": "HIGH"},
        {"region": "Mumbai", "risk_level": "HIGH"},
        {"region": "Bangalore", "risk_level": "LOW"},
        {"region": "Hyderabad", "risk_level": "MEDIUM"},
        {"region": "Kolkata", "risk_level": "HIGH"}
    ]


# -----------------------------
# Detect Transaction
# -----------------------------
@app.post("/detect")
def detect_fraud(transaction: dict):
    return fraud_detection(transaction)


# -----------------------------
# Scan QR
# -----------------------------
@app.post("/scan_qr")
def scan_qr(data: dict):

    parsed = parse_qs(data["qr_data"].split("?")[1])

    upi_id = parsed.get("pa", ["unknown"])[0]
    amount = float(parsed.get("am", [0])[0])

    transaction = {
        "amount": amount,
        "time_of_day": 16,
        "receiver_age_days": 5 if upi_id in BLACKLISTED_UPI else 150,
        "receiver_report_count": UPI_REPORTS.get(upi_id, 0),
        "location_risk": 0.6,
        "device_trust_score": 0.7,
        "upi_id": upi_id
    }

    return {
        "upi_id": upi_id,
        "amount": amount,
        **fraud_detection(transaction)
    }


# -----------------------------
# Check Payment Link
# -----------------------------
@app.post("/check_link")
def check_link(data: dict):

    link = data.get("link")

    upi_id = extract_upi(link)
    amount = extract_amount(link)

    transaction = {
        "amount": amount,
        "time_of_day": 14,
        "receiver_age_days": 5 if upi_id in BLACKLISTED_UPI else 200,
        "receiver_report_count": UPI_REPORTS.get(upi_id, 0),
        "location_risk": 0.7,
        "device_trust_score": 0.6,
        "upi_id": upi_id
    }

    return {
        "upi_id": upi_id,
        "amount": amount,
        **fraud_detection(transaction)
    }


# -----------------------------
# Website Check
# -----------------------------
@app.post("/check_website")
def check_website(data: dict):

    suspicious_sites = ["fakepay.com", "scamupi.net", "fraudpay.org"]

    website = data.get("domain")

    if website in suspicious_sites:
        return {
            "website": website,
            "risk": "HIGH",
            "message": "Website flagged as suspicious"
        }

    return {
        "website": website,
        "risk": "LOW",
        "message": "Website appears safe"
    }
