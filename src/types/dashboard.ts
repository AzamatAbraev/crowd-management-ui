export interface Building {
  id: string;
  name: string;
  capacity: number;
  current: number;
  zone: string;
  floors: Floor[];
}

export interface Floor {
  id: number;
  label: string;
  rooms: Room[];
  liveCapacity: number;
  maxCapacity: number;
  trendData: number[];
}

export interface Room {
  id: string;
  name: string;
  occupancy: number;
  size: "large" | "medium" | "small";
  activeUsers?: number;
}

export interface HistoricalBuilding {
  name: string;
  footfall: number;
  avgOccupancy: number;
  peakHour: string;
  risk: "High" | "Moderate" | "Low";
}

export interface Alert {
  id: string;
  building: string;
  floor?: string;
  occupancy: number;
  message: string;
  severity: "critical" | "warning" | "info";
}
