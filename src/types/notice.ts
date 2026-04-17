export type NoticeType = 'CLOSURE' | 'UNAVAILABLE' | 'MAINTENANCE' | 'RESTORED';

export interface RoomNotice {
  id: string;
  roomName: string;
  buildingId: string;
  type: NoticeType;
  message: string;
  startTime: string | null;
  endTime: string | null;
  createdBy: string;
  createdAt: string;
  active: boolean;
}

export interface CreateNoticeRequest {
  roomName: string;
  buildingId: string;
  type: NoticeType;
  message: string;
  startTime: string | null;
  endTime: string | null;
}
