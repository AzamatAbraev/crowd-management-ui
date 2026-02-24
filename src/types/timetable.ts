export interface TimetableEntry {
  subject: string;
  className: string;
  teacherName: string;
  groupName: string;
  classroom: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  timestamp: string;
  message: string;
  data: T;
}

export interface TimetableFilters {
  day?: string;
  className?: string;
  teacher?: string;
  subject?: string;
  classroom?: string;
  group?: string;
}
