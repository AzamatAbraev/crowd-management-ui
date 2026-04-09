import type { Alert, Building, HistoricalBuilding } from "../types/dashboard";

export const BUILDINGS_DATA: Building[] = [
  {
    id: "LRC",
    name: "Learning Resource Center",
    capacity: 500,
    current: 210,
    zone: "Main Campus",
    floors: [
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 55,
        maxCapacity: 120,
        trendData: [30, 40, 45, 55, 52, 55, 50],
        rooms: [
          { id: "gen-lrc-2", name: "General Area", occupancy: 46, size: "large" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 88,
        maxCapacity: 180,
        trendData: [60, 70, 80, 90, 95, 88, 85],
        rooms: [
          { id: "113", name: "Room 113", occupancy: 55, size: "large" },
        ],
      },
    ],
  },
  {
    id: "ATB",
    name: "Amir Temur Building",
    capacity: 800,
    current: 320,
    zone: "Main Campus",
    floors: [
      {
        id: 3,
        label: "Floor 3",
        liveCapacity: 65,
        maxCapacity: 150,
        trendData: [40, 50, 55, 65, 60, 65, 62],
        rooms: [
          { id: "311-atb", name: "Room 311", occupancy: 65, size: "medium" },
        ],
      },
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 95,
        maxCapacity: 200,
        trendData: [50, 70, 85, 95, 90, 95, 88],
        rooms: [
          { id: "214-atb", name: "Room 214", occupancy: 48, size: "medium" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 120,
        maxCapacity: 200,
        trendData: [80, 95, 110, 120, 115, 120, 118],
        rooms: [
          { id: "canteen-atb", name: "Canteen", occupancy: 72, size: "large", activeUsers: 120 },
        ],
      },
    ],
  },
  {
    id: "SHB",
    name: "Shakhrisabz Building",
    capacity: 700,
    current: 285,
    zone: "Main Campus",
    floors: [
      {
        id: 4,
        label: "Floor 4",
        liveCapacity: 30,
        maxCapacity: 100,
        trendData: [15, 20, 25, 30, 28, 30, 25],
        rooms: [
          { id: "406-shb", name: "Room 406", occupancy: 30, size: "medium" },
        ],
      },
      {
        id: 3,
        label: "Floor 3",
        liveCapacity: 45,
        maxCapacity: 150,
        trendData: [20, 30, 35, 45, 40, 45, 42],
        rooms: [
          { id: "gen-shb-3", name: "General Area", occupancy: 30, size: "large" },
        ],
      },
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 80,
        maxCapacity: 160,
        trendData: [40, 55, 65, 80, 75, 80, 78],
        rooms: [
          { id: "216-shb", name: "Room 216", occupancy: 50, size: "medium" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 110,
        maxCapacity: 200,
        trendData: [60, 80, 100, 110, 105, 110, 108],
        rooms: [
          { id: "student-zone", name: "Student Zone", occupancy: 65, size: "large", activeUsers: 110 },
        ],
      },
    ],
  },
  {
    id: "IB",
    name: "Istiqbol Building",
    capacity: 600,
    current: 240,
    zone: "Main Campus",
    floors: [
      {
        id: 4,
        label: "Floor 4",
        liveCapacity: 25,
        maxCapacity: 100,
        trendData: [10, 15, 20, 25, 22, 25, 20],
        rooms: [
          { id: "311-ib-4", name: "Room 311", occupancy: 25, size: "medium" },
        ],
      },
      {
        id: 3,
        label: "Floor 3",
        liveCapacity: 55,
        maxCapacity: 150,
        trendData: [30, 40, 48, 55, 50, 55, 52],
        rooms: [
          { id: "311-ib-3", name: "Room 311", occupancy: 37, size: "medium" },
        ],
      },
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 70,
        maxCapacity: 150,
        trendData: [40, 50, 60, 70, 65, 70, 68],
        rooms: [
          { id: "214-ib", name: "Room 214", occupancy: 47, size: "medium" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 90,
        maxCapacity: 180,
        trendData: [50, 65, 78, 90, 85, 90, 88],
        rooms: [
          { id: "canteen-ib", name: "Canteen", occupancy: 60, size: "large", activeUsers: 90 },
        ],
      },
    ],
  },
  {
    id: "Lyceum",
    name: "Academic Lyceum of Westminster University",
    capacity: 400,
    current: 145,
    zone: "Main Campus",
    floors: [
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 60,
        maxCapacity: 150,
        trendData: [30, 40, 50, 60, 55, 60, 58],
        rooms: [
          { id: "lyceum-hall", name: "Lyceum Hall", occupancy: 40, size: "large" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 85,
        maxCapacity: 200,
        trendData: [40, 55, 70, 85, 80, 85, 82],
        rooms: [
          { id: "canteen-lyceum", name: "Canteen", occupancy: 55, size: "large", activeUsers: 85 },
        ],
      },
    ],
  },
  {
    id: "Sports Hall",
    name: "Sports Hall",
    capacity: 300,
    current: 95,
    zone: "Main Campus",
    floors: [
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 45,
        maxCapacity: 100,
        trendData: [20, 30, 38, 45, 42, 45, 44],
        rooms: [
          { id: "gym", name: "GYM", occupancy: 45, size: "large" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 50,
        maxCapacity: 150,
        trendData: [25, 35, 42, 50, 48, 50, 47],
        rooms: [
          { id: "main-hall", name: "Main Hall", occupancy: 33, size: "large" },
        ],
      },
    ],
  },
];

export const ALERTS_DATA: Alert[] = [
  {
    id: "a1",
    building: "Learning Resource Center",
    floor: "Floor 1",
    occupancy: 88,
    message: "Room 113 approaching capacity",
    severity: "critical",
  },
  {
    id: "a2",
    building: "Amir Temur Building",
    floor: "Floor 1",
    occupancy: 72,
    message: "Canteen lunch peak predicted for next 45m",
    severity: "warning",
  },
  {
    id: "a3",
    building: "Shakhrisabz Building",
    floor: "Floor 1",
    occupancy: 65,
    message: "Student Zone approaching capacity",
    severity: "warning",
  },
  {
    id: "a4",
    building: "Istiqbol Building",
    occupancy: 60,
    message: "Occupancy above normal for this time",
    severity: "info",
  },
  {
    id: "a5",
    building: "Lyceum",
    occupancy: 55,
    message: "Steady increase over last 2 hours",
    severity: "info",
  },
];

export const HISTORICAL_BUILDINGS: HistoricalBuilding[] = [
  {
    name: "Learning Resource Center",
    footfall: 42501,
    avgOccupancy: 84,
    peakHour: "14:00 – 16:00",
    risk: "High",
  },
  {
    name: "Amir Temur Building",
    footfall: 38122,
    avgOccupancy: 62,
    peakHour: "12:00 – 13:30",
    risk: "Moderate",
  },
  {
    name: "Shakhrisabz Building",
    footfall: 22400,
    avgOccupancy: 45,
    peakHour: "09:00 – 11:00",
    risk: "Low",
  },
  {
    name: "Istiqbol Building",
    footfall: 18890,
    avgOccupancy: 40,
    peakHour: "10:00 – 12:00",
    risk: "Low",
  },
];

export const generateTrend = (base: number, variance: number, points = 60) =>
  Array.from({ length: points }, (_, i) =>
    Math.max(
      0,
      Math.min(
        100,
        base +
          Math.sin(i * 0.4) * variance +
          (Math.random() - 0.5) * variance * 0.5,
      ),
    ),
  );

export const TREND_DATA = {
  LRC: generateTrend(72, 22),
  ATB: generateTrend(58, 18),
  SHB: generateTrend(45, 20),
};
