import { useEffect, useState } from "react";
import { api } from "../../server";
import { AxiosError, type AxiosResponse } from "axios";

interface OccupancyData {
  count: number;
}

const OccupancyPage = () => {
  const [count, setCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [status, setStatus] = useState<string>("Loading...");

  const API_URL = "/people/count";

  const fetchCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<OccupancyData> = await api.get(API_URL);

      setCount(response.data.count);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatus("Connected");

    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        window.location.href = "http://localhost:8082/oauth2/authorization/keycloak";
      } else {
        console.error("Fetch error:", err.message);
        setStatus("Error Connecting");
      }
    }
  };

  useEffect(() => {
    fetchCount();

    const interval = setInterval(fetchCount, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
      <div style={{
        display: "inline-block",
        padding: "5px 15px",
        borderRadius: "20px",
        background: status === "Connected" ? "#e8f5e9" : "#ffebee",
        color: status === "Connected" ? "#2e7d32" : "#c62828",
        fontSize: "0.9rem"
      }}>
        ● {status}
      </div>

      <h1 style={{ color: "#34495e" }}>Live Occupancy</h1>

      <div style={{ fontSize: "6rem", fontWeight: "bold", color: "#2c3e50" }}>
        {count}
      </div>

      <p style={{ fontSize: "1.2rem", color: "#7f8c8d" }}>
        Last Updated: {lastUpdated || "Waiting for data..."}
      </p>
    </div>
  );
};

export default OccupancyPage;