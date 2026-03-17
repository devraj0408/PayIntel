const API_BASE = "https://payintel.onrender.com";

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface DetectRequest {
  upi_id: string;
  amount: number;
  time_of_day: number;
  receiver_age_days: number;
  receiver_report_count: number;
  location_risk: number;
  device_trust_score: number;
}

export interface DetectResponse {
  risk_level: string;
  decision: string;
  reasons: string[];
  risk_score?: number;
}

export interface FraudStats {
  total_transactions: number;
  fraud_detected: number;
  warnings: number;
  safe_payments: number;
}

export interface FlaggedUpi {
  upi_id: string;
  reports: number;
}

export interface HeatmapEntry {
  region: string;
  risk_level: string;
}

export const api = {
  detect: (data: DetectRequest) =>
    apiCall<DetectResponse>("/detect", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  scanQr: (qr_data: string) =>
    apiCall<DetectResponse>("/scan_qr", {
      method: "POST",
      body: JSON.stringify({ qr_data }),
    }),

  checkLink: (link: string) =>
    apiCall<DetectResponse>("/check_link", {
      method: "POST",
      body: JSON.stringify({ link }),
    }),

  checkWebsite: (domain: string) =>
    apiCall<any>("/check_website", {
      method: "POST",
      body: JSON.stringify({ domain }),
    }),

  fraudStats: () => apiCall<FraudStats>("/fraud_stats"),

  flaggedUpi: () => apiCall<FlaggedUpi[]>("/flagged_upi"),

  riskHeatmap: () => apiCall<HeatmapEntry[]>("/risk_heatmap"),
};
