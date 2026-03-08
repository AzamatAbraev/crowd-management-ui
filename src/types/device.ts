export type DeviceType = 'ULTRASONIC_SENSOR' | 'CAMERA' | 'THERMAL_SENSOR' | 'GATEWAY' | 'RFID_READER' | 'UNKNOWN';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'DECOMMISSIONED';
export type DeviceHealth = 'GOOD' | 'WARNING' | 'CRITICAL' | 'UNKNOWN';

export interface Device {
  id: string;
  name: string;
  location: string;
  type: DeviceType;
  status: DeviceStatus;
  health: DeviceHealth;
  batteryLevel: number | null;
  sensors: string[];
  firmwareVersion: string;
  lastSeen: string;
  registeredAt: string;
  metadata: Record<string, any>;
}
