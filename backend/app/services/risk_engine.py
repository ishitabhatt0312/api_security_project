def calculate_risk(log):
    risk = 0

    # Rule 1: Failed request
    if log.status_code >= 400:
        risk += 40

    # Rule 2: Slow response
    if log.response_time > 1:
        risk += 20

    # Rule 3: Sensitive endpoint
    if "transfer" in log.endpoint:
        risk += 30

    return risk

def get_risk_level(score):
    if score > 70:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    else:
        return "LOW"