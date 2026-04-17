import { api } from '../server';
import type { ApiResponse } from '../types/timetable';
import type { RoomNotice, CreateNoticeRequest } from '../types/notice';

export const noticeService = {
  getActiveNotices: async (): Promise<RoomNotice[]> => {
    try {
      const response = await api.get<ApiResponse<RoomNotice[]>>('/notices', {
        params: { activeOnly: true },
      });
      return response.data.data ?? [];
    } catch {
      return [];
    }
  },

  getAllNotices: async (): Promise<RoomNotice[]> => {
    try {
      const response = await api.get<ApiResponse<RoomNotice[]>>('/notices');
      return response.data.data ?? [];
    } catch {
      return [];
    }
  },

  createNotice: async (request: CreateNoticeRequest): Promise<RoomNotice> => {
    const response = await api.post<ApiResponse<RoomNotice>>('/notices', request);
    return response.data.data;
  },

  resolveNotice: async (id: string): Promise<RoomNotice> => {
    const response = await api.patch<ApiResponse<RoomNotice>>(`/notices/${id}/resolve`);
    return response.data.data;
  },

  deleteNotice: async (id: string): Promise<void> => {
    await api.delete(`/notices/${id}`);
  },
};
