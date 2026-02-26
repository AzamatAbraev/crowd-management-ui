import type {
  ApiResponse,
  TimetableEntry,
  TimetableFilters,
} from "../types/timetable";
import { api } from "../server";

export const fetchTimetable = async (
  filters: TimetableFilters,
): Promise<TimetableEntry[]> => {
  const params: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      params[key] = value;
    }
  });

  const response = await api.get<ApiResponse<TimetableEntry[]>>(
    "/resources/timetable",
    { params },
  );

  if (response.data.code !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};
