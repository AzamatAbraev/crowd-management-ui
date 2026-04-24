export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface DataStatus {
  hasRealData: boolean;
  hasDemoData: boolean;
}

export type AnalyticsRange = '7d' | '30d' | '90d';

export interface BuildingAnalytics {
  buildingId: string;
  buildingName: string;
  points: AnalyticsPoint[];
}

export interface ChartPoint {
  label: string;
  [buildingId: string]: string | number;
}
