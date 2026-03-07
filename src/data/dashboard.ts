import type { Alert, Building, HistoricalBuilding } from "../types/dashboard";

export const BUILDINGS_DATA: Building[] = [
  {
    id: "library",
    name: "Main Library",
    capacity: 12000,
    current: 4250,
    zone: "Academic Core",
    floors: [
      {
        id: 5,
        label: "Floor 5",
        liveCapacity: 18,
        maxCapacity: 60,
        trendData: [10, 14, 12, 18, 15, 18, 17],
        rooms: [
          { id: "501", name: "Archive Room", occupancy: 18, size: "medium" },
          { id: "502", name: "Research Suite", occupancy: 45, size: "large" },
        ],
      },
      {
        id: 4,
        label: "Floor 4",
        liveCapacity: 55,
        maxCapacity: 80,
        trendData: [30, 40, 45, 55, 52, 55, 50],
        rooms: [
          { id: "401", name: "Group Study A", occupancy: 72, size: "large" },
          { id: "402", name: "Silent Zone", occupancy: 38, size: "medium" },
        ],
      },
      {
        id: 3,
        label: "Floor 3",
        liveCapacity: 142,
        maxCapacity: 200,
        trendData: [80, 100, 120, 130, 142, 138, 142],
        rooms: [
          {
            id: "301",
            name: "Advanced Physics Lab",
            occupancy: 88,
            size: "large",
            activeUsers: 24,
          },
          { id: "305", name: "Faculty Office", occupancy: 12, size: "small" },
          { id: "306", name: "Study Lounge", occupancy: 54, size: "medium" },
          { id: "302", name: "Seminar Room B", occupancy: 25, size: "medium" },
          {
            id: "308",
            name: "Main Cafeteria Extension",
            occupancy: 62,
            size: "large",
            activeUsers: 4,
          },
        ],
      },
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 192,
        maxCapacity: 200,
        trendData: [120, 150, 170, 185, 192, 190, 192],
        rooms: [
          {
            id: "201",
            name: "Quiet Study Zone",
            occupancy: 96,
            size: "large",
            activeUsers: 192,
          },
          { id: "202", name: "Computer Lab", occupancy: 78, size: "large" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 98,
        maxCapacity: 180,
        trendData: [60, 70, 80, 90, 95, 98, 95],
        rooms: [
          {
            id: "101",
            name: "Main Entrance Hall",
            occupancy: 55,
            size: "large",
          },
          { id: "102", name: "Reference Desk", occupancy: 30, size: "small" },
        ],
      },
    ],
  },
  {
    id: "union",
    name: "Student Union",
    capacity: 8000,
    current: 2820,
    zone: "Central Campus",
    floors: [
      {
        id: 3,
        label: "Floor 3",
        liveCapacity: 40,
        maxCapacity: 150,
        trendData: [20, 25, 30, 35, 40, 38, 40],
        rooms: [
          { id: "301", name: "Event Hall", occupancy: 27, size: "large" },
        ],
      },
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 110,
        maxCapacity: 200,
        trendData: [60, 80, 95, 105, 110, 108, 110],
        rooms: [
          {
            id: "201",
            name: "Student Lounge",
            occupancy: 62,
            size: "large",
            activeUsers: 110,
          },
          { id: "202", name: "Game Room", occupancy: 41, size: "medium" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 165,
        maxCapacity: 200,
        trendData: [80, 100, 130, 155, 165, 160, 165],
        rooms: [
          {
            id: "101",
            name: "Dining Hall",
            occupancy: 88,
            size: "large",
            activeUsers: 165,
          },
          { id: "102", name: "Cafeteria Annex", occupancy: 72, size: "medium" },
          { id: "103", name: "Info Desk", occupancy: 15, size: "small" },
        ],
      },
    ],
  },
  {
    id: "science",
    name: "Science Building",
    capacity: 5000,
    current: 1430,
    zone: "Innovation District, North Campus",
    floors: [
      {
        id: 5,
        label: "Floor 5",
        liveCapacity: 22,
        maxCapacity: 80,
        trendData: [10, 15, 18, 20, 22, 21, 22],
        rooms: [
          {
            id: "501",
            name: "Observatory Deck",
            occupancy: 28,
            size: "medium",
          },
        ],
      },
      {
        id: 4,
        label: "Floor 4",
        liveCapacity: 45,
        maxCapacity: 120,
        trendData: [20, 28, 35, 40, 45, 43, 45],
        rooms: [
          {
            id: "401",
            name: "Chemistry Lab",
            occupancy: 65,
            size: "large",
            activeUsers: 45,
          },
          { id: "402", name: "Prep Room", occupancy: 20, size: "small" },
        ],
      },
      {
        id: 3,
        label: "Floor 3 (Active)",
        liveCapacity: 142,
        maxCapacity: 200,
        trendData: [80, 100, 115, 130, 142, 138, 142],
        rooms: [
          {
            id: "301",
            name: "Advanced Physics Lab",
            occupancy: 88,
            size: "large",
            activeUsers: 24,
          },
          { id: "305", name: "Faculty Office", occupancy: 12, size: "small" },
          { id: "306", name: "Study Lounge", occupancy: 54, size: "medium" },
          { id: "302", name: "Seminar Room B", occupancy: 25, size: "medium" },
          {
            id: "308",
            name: "Main Cafeteria Extension",
            occupancy: 62,
            size: "large",
            activeUsers: 4,
          },
        ],
      },
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 88,
        maxCapacity: 160,
        trendData: [40, 55, 65, 75, 88, 85, 88],
        rooms: [
          { id: "201", name: "Biology Lab", occupancy: 55, size: "large" },
          {
            id: "202",
            name: "Microscopy Suite",
            occupancy: 40,
            size: "medium",
          },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 60,
        maxCapacity: 140,
        trendData: [30, 40, 48, 55, 60, 58, 60],
        rooms: [
          { id: "101", name: "Lecture Hall A", occupancy: 43, size: "large" },
          { id: "102", name: "Reception", occupancy: 20, size: "small" },
        ],
      },
    ],
  },
  {
    id: "gym",
    name: "Fitness Center",
    capacity: 3000,
    current: 960,
    zone: "Athletics District",
    floors: [
      {
        id: 2,
        label: "Floor 2",
        liveCapacity: 30,
        maxCapacity: 80,
        trendData: [15, 20, 25, 28, 30, 29, 30],
        rooms: [
          { id: "201", name: "Cardio Zone", occupancy: 37, size: "large" },
        ],
      },
      {
        id: 1,
        label: "Floor 1",
        liveCapacity: 96,
        maxCapacity: 200,
        trendData: [50, 65, 75, 88, 96, 93, 96],
        rooms: [
          {
            id: "101",
            name: "Weight Room",
            occupancy: 48,
            size: "large",
            activeUsers: 96,
          },
          { id: "102", name: "Court A", occupancy: 90, size: "large" },
          { id: "103", name: "Locker Room", occupancy: 22, size: "medium" },
        ],
      },
    ],
  },
];

export const ALERTS_DATA: Alert[] = [
  {
    id: "a1",
    building: "Main Library",
    floor: "Floor 2",
    occupancy: 96,
    message: "Quiet study zone overflow detected",
    severity: "critical",
  },
  {
    id: "a2",
    building: "Student Union",
    floor: "Dining",
    occupancy: 88,
    message: "Lunch peak predicted for next 45m",
    severity: "warning",
  },
  {
    id: "a3",
    building: "Science Building",
    floor: "Floor 3",
    occupancy: 82,
    message: "Lab B approaching capacity",
    severity: "warning",
  },
  {
    id: "a4",
    building: "Med-School Lecture Hall",
    occupancy: 76,
    message: "Occupancy above normal for this time",
    severity: "info",
  },
  {
    id: "a5",
    building: "North Commons Annex",
    occupancy: 64,
    message: "Steady increase over last 2 hours",
    severity: "info",
  },
];

export const HISTORICAL_BUILDINGS: HistoricalBuilding[] = [
  {
    name: "Main Library",
    footfall: 42501,
    avgOccupancy: 84,
    peakHour: "14:00 – 16:00",
    risk: "High",
  },
  {
    name: "Student Union",
    footfall: 38122,
    avgOccupancy: 62,
    peakHour: "12:00 – 13:30",
    risk: "Moderate",
  },
  {
    name: "Engineering Hall",
    footfall: 12400,
    avgOccupancy: 31,
    peakHour: "09:00 – 11:00",
    risk: "Low",
  },
  {
    name: "Arts Quad",
    footfall: 22890,
    avgOccupancy: 55,
    peakHour: "15:00 – 17:00",
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
  library: generateTrend(72, 22),
  union: generateTrend(58, 18),
  science: generateTrend(45, 20),
};
