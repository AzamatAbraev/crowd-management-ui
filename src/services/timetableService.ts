import type {
  ApiResponse,
  TimetableEntry,
  TimetableFilters,
  TimetableMetadata,
} from "../types/timetable";
import { api } from "../server";

/**
 * Fetches the filtered timetable entries
 */
export const fetchTimetable = async (
  filters: TimetableFilters,
): Promise<TimetableEntry[]> => {
  const params: Record<string, string> = {};

  // Clean up filters: only send non-empty values to the backend
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      params[key] = value;
    }
  });

  const response = await api.get<ApiResponse<TimetableEntry[]>>(
    "/resources/timetable",
    { params },
  );

  // Your ResponseBuilder sends 'success' or '200'
  if (response.data.status !== "success" && response.data.code !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const fetchTimetableMetadata = async (): Promise<TimetableMetadata> => {
  const response = await api.get<ApiResponse<TimetableMetadata>>(
    "/resources/timetable/metadata",
  );
  const d = response.data.data;
  return {
    subjects: d.subjects || [],
    teachers: d.teachers || [],
    classrooms: d.classrooms || [],
    classes: d.classes || [],
    times: d.times || [],
    endTimes: d.endTimes || [],
  };
};
