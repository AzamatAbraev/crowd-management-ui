export interface Room {
  id: string;
  occupied: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const rooms: Room[] = [
  { id: "05.103", occupied: false, x: 120, y: 260, width: 80, height: 60 },
  { id: "05.107", occupied: false, x: 220, y: 260, width: 80, height: 60 },
  { id: "05.108", occupied: true, x: 320, y: 260, width: 80, height: 60 },
  { id: "05.201", occupied: false, x: 420, y: 260, width: 80, height: 60 },
  { id: "05.203", occupied: false, x: 520, y: 260, width: 80, height: 60 },
  { id: "05.221", occupied: false, x: 620, y: 260, width: 80, height: 60 },
  { id: "05.251", occupied: false, x: 720, y: 260, width: 80, height: 60 },
  { id: "05.252", occupied: false, x: 120, y: 360, width: 80, height: 60 },
  { id: "05.300", occupied: false, x: 220, y: 360, width: 80, height: 60 },
  { id: "05.301", occupied: false, x: 320, y: 360, width: 80, height: 60 },
  { id: "05.303", occupied: false, x: 420, y: 360, width: 80, height: 60 },
  { id: "05.401", occupied: true, x: 520, y: 360, width: 80, height: 60 },
  { id: "05.402", occupied: true, x: 620, y: 360, width: 80, height: 60 },
  { id: "05.403", occupied: false, x: 720, y: 360, width: 80, height: 60 },
  { id: "05.407", occupied: false, x: 820, y: 360, width: 80, height: 60 },
];
