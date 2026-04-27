import type {
  BuildingAnalytics,
  AnalyticsPoint,
  AnalyticsRange,
} from "../types/analytics";
import type { Building } from "../types/building";

const CLASSROOM_WEEKDAY = [
  0, 0, 0, 0, 0, 2, 5, 12, 55, 85, 90, 88, 72, 65, 80, 88, 82, 70, 50, 38, 22,
  8, 2, 0,
];
const CLASSROOM_SATURDAY = [
  0, 0, 0, 0, 0, 1, 3, 8, 42, 68, 72, 68, 55, 48, 58, 60, 42, 22, 8, 3, 1, 0, 0,
  0,
];
const CLASSROOM_SUNDAY = [
  0, 0, 0, 0, 0, 0, 0, 2, 5, 8, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0,
];

const LIBRARY_WEEKDAY = [
  0, 0, 0, 0, 0, 1, 3, 12, 35, 58, 68, 72, 80, 85, 78, 80, 88, 92, 85, 72, 52,
  28, 5, 0,
];
const LIBRARY_SATURDAY = [
  0, 0, 0, 0, 0, 0, 1, 5, 22, 42, 55, 60, 65, 62, 55, 45, 28, 12, 5, 2, 0, 0, 0,
  0,
];
const LIBRARY_SUNDAY = [
  0, 0, 0, 0, 0, 0, 0, 1, 10, 22, 35, 42, 45, 42, 38, 30, 18, 8, 2, 0, 0, 0, 0,
  0,
];

const BUILDING_CFG: Record<
  string,
  { capacity: number; type: "classroom" | "library" }
> = {
  LRC: { capacity: 680, type: "library" },
  ATB: { capacity: 570, type: "classroom" },
  SHB: { capacity: 420, type: "classroom" },
  IB: { capacity: 280, type: "classroom" },
  Lyceum: { capacity: 195, type: "classroom" },
};

export const DEMO_BUILDINGS: Building[] = [
  { id: "LRC", name: "Learning Resource Center" },
  { id: "ATB", name: "Amir Temur Building" },
  { id: "SHB", name: "Shakhrisabz Building" },
  { id: "IB", name: "Istiqbol Building" },
  { id: "Lyceum", name: "Academic Lyceum" },
];

function getPattern(buildingId: string, dayOfWeek: number): number[] {
  const type = BUILDING_CFG[buildingId]?.type ?? "classroom";
  if (dayOfWeek === 0)
    return type === "library" ? LIBRARY_SUNDAY : CLASSROOM_SUNDAY;
  if (dayOfWeek === 6)
    return type === "library" ? LIBRARY_SATURDAY : CLASSROOM_SATURDAY;
  return type === "library" ? LIBRARY_WEEKDAY : CLASSROOM_WEEKDAY;
}

function stableNoise(date: Date, buildingId: string, seed: number): number {
  let h =
    (date.getFullYear() * 10000 +
      (date.getMonth() + 1) * 100 +
      date.getDate() +
      seed) >>>
    0;
  for (let i = 0; i < buildingId.length; i++) {
    h = (h * 31 + buildingId.charCodeAt(i)) >>> 0;
  }
  h = (h * 1664525 + 1013904223) >>> 0;
  return 0.88 + (h / 0xffffffff) * 0.24;
}

function dailyCount(
  buildingId: string,
  date: Date,
  fallbackCapacity: number,
  seed: number,
): number {
  const cfg = BUILDING_CFG[buildingId] ?? {
    capacity: fallbackCapacity,
    type: "classroom" as const,
  };
  const pattern = getPattern(buildingId, date.getDay());
  const avgPct = pattern.reduce((s, v) => s + v, 0) / 24;
  const n = stableNoise(date, buildingId, seed);
  return Math.max(1, Math.round((avgPct / 100) * cfg.capacity * n));
}

export interface HourlyPoint {
  hour: number;
  label: string;
  [buildingId: string]: number | string;
}

export function generateHourlyOccupancy(buildings: Building[]): HourlyPoint[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const point: HourlyPoint = {
      hour,
      label: `${String(hour).padStart(2, "0")}:00`,
    };
    for (const b of buildings) {
      const cfg = BUILDING_CFG[b.id] ?? {
        capacity: 300,
        type: "classroom" as const,
      };
      const pattern = getPattern(b.id, 1); // Monday = representative weekday
      point[b.id] = Math.round((pattern[hour] / 100) * cfg.capacity);
    }
    return point;
  });
}

export function generateDemoAnalytics(
  buildings: Building[],
  range: AnalyticsRange,
  seed = 0,
): BuildingAnalytics[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const stepDays = range === "90d" ? 7 : 1;

  return buildings.map((b, idx) => {
    const fallbackCapacity = Math.max(150, 500 - idx * 60);
    const points: AnalyticsPoint[] = [];

    for (let offset = totalDays; offset >= 0; offset -= stepDays) {
      const bucketStart = new Date(today);
      bucketStart.setDate(today.getDate() - offset);

      let value: number;
      if (stepDays === 1) {
        value = dailyCount(b.id, bucketStart, fallbackCapacity, seed);
      } else {
        let sum = 0;
        for (let d = 0; d < stepDays; d++) {
          const day = new Date(bucketStart);
          day.setDate(bucketStart.getDate() + d);
          sum += dailyCount(b.id, day, fallbackCapacity, seed);
        }
        value = Math.round(sum / stepDays);
      }

      points.push({ label: bucketStart.toISOString(), value });
    }

    return { buildingId: b.id, buildingName: b.name, points };
  });
}
