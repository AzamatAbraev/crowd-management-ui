import {
  ALERTS_DATA,
  BUILDINGS_DATA,
  HISTORICAL_BUILDINGS,
} from "../data/dashboard";
import type { Alert, Building, HistoricalBuilding } from "../types/dashboard";

export const campusService = {
  getBuildings: async (): Promise<Building[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return BUILDINGS_DATA;
  },
  getAlerts: async (): Promise<Alert[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return ALERTS_DATA;
  },
  getHistoricalBuildings: async (): Promise<HistoricalBuilding[]> => {
    await new Promise((r) => setTimeout(r, 250));
    return HISTORICAL_BUILDINGS;
  },
};
