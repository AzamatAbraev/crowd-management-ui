import { api } from '../server';
import type { AnalyticsPoint, AnalyticsRange, DataStatus } from '../types/analytics';

const rangeToPath: Record<AnalyticsRange, string> = {
  '7d': 'last7d',
  '30d': 'last30d',
  '90d': 'last90d',
};

export const analyticsService = {
  getDataStatus: async (): Promise<DataStatus> => {
    try {
      const res = await api.get<DataStatus>('/analytics/hasData');
      return res.data;
    } catch {
      return { hasRealData: false, hasDemoData: false };
    }
  },

  getBuildingData: async (buildingId: string, range: AnalyticsRange): Promise<AnalyticsPoint[]> => {
    try {
      const res = await api.get<AnalyticsPoint[]>(`/analytics/building/${buildingId}/${rangeToPath[range]}`);
      return res.data ?? [];
    } catch {
      return [];
    }
  },

  getAvailableBuildings: async (): Promise<string[]> => {
    try {
      const res = await api.get<string[]>('/analytics/buildings');
      return res.data ?? [];
    } catch {
      return [];
    }
  },

  insertDemoData: async (): Promise<{ buildingsFound: number }> => {
    const res = await api.post<{ buildingsFound: number }>('/analytics/demo');
    return res.data;
  },
};
