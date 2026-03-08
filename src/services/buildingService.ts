import { api } from '../server';
import type { Building } from '../types/building';

export const buildingService = {
  getAllBuildings: async (): Promise<Building[]> => {
    try {
      const response = await api.get('buildings');
      return response.data;
    } catch (error) {
      console.error('Error fetching buildings:', error);
      return [];
    }
  }
};
