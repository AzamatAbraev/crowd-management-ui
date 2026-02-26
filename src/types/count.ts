export interface CountMessage {
  count: number;
}

export interface OccupancyState {
  buildingId: string;
  currentOccupancy: number;
  capacityLimit: number;
  capacityPercentage: number;
  status: string;
  lastUpdated: number;
}
