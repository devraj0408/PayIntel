def extract_features(transaction):

    features = [
        transaction["amount"],
        transaction["time_of_day"],
        transaction["receiver_age_days"],
        transaction["receiver_report_count"],
        transaction["location_risk"],
        transaction["device_trust_score"]
    ]

    return features