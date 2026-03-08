
import type { Device } from '../types/device';
import { api } from '../server';

export const deviceService = {
  getAllDevices: async (): Promise<Device[]> => {
    try {
      const response = await api.get(`devices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  },

  updateDeviceStatus: async (id: string, status: string, health: string): Promise<Device | null> => {
    try {
      const response = await api.patch(`devices/${id}/status`, { status, health });
      return response.data;
    } catch (error) {
      console.error(`Error updating device ${id} status:`, error);
      return null;
    }
  },

  createDevice: async (deviceData: { id: string; name: string; type: string; location: string; status?: string; health?: string }): Promise<Device | null> => {
    try {
      const response = await api.post('devices', {
        ...deviceData,
        status: deviceData.status || 'ONLINE',
        health: deviceData.health || 'GOOD',
      });
      return response.data;
    } catch (error) {
      console.error('Error creating device:', error);
      return null;
    }
  },

  updateDevice: async (id: string, deviceData: Partial<Device>): Promise<Device | null> => {
    try {
      const response = await api.put(`devices/${id}`, deviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating device:', error);
      return null;
    }
  },

  deleteDevice: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`devices/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting device:', error);
      return false;
    }
  }
};
