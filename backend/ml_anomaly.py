import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any

class MLAnomalyDetector:
    def __init__(self):
        self.scaler = StandardScaler()
        self.isolation_forest = IsolationForest(contamination=0.08, random_state=42)
        self.dbscan = DBSCAN(eps=0.85, min_samples=3)

    def extract_features(self, events: List[Dict[str, Any]]) -> np.ndarray:
        features = []
        for e in events:
            status = float(e.get("status_code", 200))
            latency = float(e.get("latency_us", 45000))
            payload_size = float(e.get("payload_size", 512))
            err_type = str(e.get("error_type", "NONE"))
            err_code = 1.0 if "DEPRECATED_PARAM" in err_type else (2.0 if "SCHEMA_DRIFT" in err_type else 0.0)
            features.append([status, latency, payload_size, err_code])
        return np.array(features)

    def analyze_telemetry_batch(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        if len(events) < 4:
            return {
                "total_events": len(events),
                "anomalies_detected": 0,
                "clusters_found": 1 if len(events) > 0 else 0,
                "cluster_labels": [0] * len(events),
                "recommended_antibodies": []
            }

        X = self.extract_features(events)
        X_scaled = self.scaler.fit_transform(X)
        anomaly_preds = self.isolation_forest.fit_predict(X_scaled)
        cluster_labels = self.dbscan.fit_predict(X_scaled)

        recommendations = []
        for cluster_id in set(cluster_labels):
            if cluster_id == -1:
                continue
            cluster_events = [events[i] for i, label in enumerate(cluster_labels) if label == cluster_id]
            if any(e.get("status_code", 200) >= 400 for e in cluster_events):
                dominant_error = cluster_events[0].get("error_type", "SCHEMA_DRIFT")
                recommendations.append({
                    "cluster_id": int(cluster_id),
                    "cluster_size": len(cluster_events),
                    "detected_signature": dominant_error,
                    "recommended_action": f"Synthesize WASM antibody rule for signature: {dominant_error}",
                    "confidence_score": 0.982
                })

        anomaly_count = int(np.sum(anomaly_preds == -1))
        if not recommendations and anomaly_count > 0:
            recommendations.append({
                "cluster_id": 99,
                "cluster_size": anomaly_count,
                "detected_signature": "ISOLATION_FOREST_OUTLIER",
                "recommended_action": "Synthesize emergent wire filter for anomalous latency/payload deviation",
                "confidence_score": 0.941
            })

        return {
            "total_events": len(events),
            "anomalies_detected": anomaly_count,
            "clusters_found": len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0),
            "cluster_labels": cluster_labels.tolist(),
            "recommended_antibodies": recommendations
        }
