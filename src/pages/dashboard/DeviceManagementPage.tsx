import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryWarning,
  RefreshCw,
  Search,
  Filter,
  Cpu,
  MapPin,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import type { Device, DeviceStatus, DeviceType } from '../../types/device';
import type { Building } from '../../types/building';
import { deviceService } from '../../services/deviceService';
import { buildingService } from '../../services/buildingService';

const DeviceManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', type: 'ULTRASONIC_SENSOR', location: '' });

  const [buildings, setBuildings] = useState<Building[]>([]);

  const fetchDevices = async () => {
    setLoading(true);
    const data = await deviceService.getAllDevices();
    setDevices(data);
    setLoading(false);
  };

  const fetchBuildings = async () => {
    const data = await buildingService.getAllBuildings();
    setBuildings(data);
  };

  useEffect(() => {
    fetchDevices();
    fetchBuildings();
    // Optional: Auto-refresh every 10 seconds for real-time monitoring
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter devices based on search
  const filteredDevices = devices.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.name && d.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Compute Fleet Stats
  const totalDevs = devices.length;
  const onlineDevs = devices.filter(d => d.status === 'ONLINE').length;
  const offlineDevs = devices.filter(d => d.status === 'OFFLINE').length;
  const warningDevs = devices.filter(d => d.status === 'MAINTENANCE' || d.health !== 'GOOD').length;

  const getStatusColor = (status: DeviceStatus) => {
    switch(status) {
      case 'ONLINE': return 'var(--status-green)';
      case 'OFFLINE': return 'var(--status-red)';
      case 'MAINTENANCE': return 'var(--status-yellow)';
      case 'DECOMMISSIONED': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBg = (status: DeviceStatus) => {
    switch(status) {
      case 'ONLINE': return 'rgba(16, 185, 129, 0.1)';
      case 'OFFLINE': return 'rgba(239, 68, 68, 0.1)';
      case 'MAINTENANCE': return 'rgba(245, 158, 11, 0.1)';
      case 'DECOMMISSIONED': return 'rgba(100, 100, 100, 0.1)';
      default: return 'transparent';
    }
  };

  const calculateUptime = (registeredAt: string) => {
    if (!registeredAt) return 0;
    const past = new Date(registeredAt).getTime();
    const now = new Date().getTime();
    return Math.floor((now - past) / (1000 * 60 * 60)); 
  };

  const handleStatusUpdate = async (id: string, state: 'ONLINE' | 'MAINTENANCE') => {
    const updated = await deviceService.updateDeviceStatus(id, state, 'UNKNOWN');
    if (updated) {
      setDevices(prev => prev.map(d => d.id === id ? updated : d));
      if (selectedDevice?.id === id) setSelectedDevice(updated);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      const success = await deviceService.deleteDevice(id);
      if (success) {
        setDevices(prev => prev.filter(d => d.id !== id));
        if (selectedDevice?.id === id) setSelectedDevice(null);
      } else {
        alert('Failed to delete device');
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice = await deviceService.createDevice({
      id: formData.id,
      name: formData.name,
      type: formData.type,
      location: formData.location
    });
    if (newDevice) {
      setDevices(prev => [...prev, newDevice]);
      setShowAddModal(false);
      setFormData({ id: '', name: '', type: 'ULTRASONIC_SENSOR', location: '' });
    } else {
      alert('Failed to provision device. It may already exist.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const updatedDevice = await deviceService.updateDevice(selectedDevice.id, {
      name: formData.name,
      type: formData.type as DeviceType,
      location: formData.location
    });
    if (updatedDevice) {
      setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
      setSelectedDevice(updatedDevice);
      setShowEditModal(false);
    } else {
      alert('Failed to update device.');
    }
  };

  const openEditModal = () => {
    if (selectedDevice) {
      setFormData({
        id: selectedDevice.id,
        name: selectedDevice.name || '',
        type: selectedDevice.type || 'ULTRASONIC_SENSOR',
        location: selectedDevice.location || ''
      });
      setShowEditModal(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Cpu color="var(--primary-teal)" size={28} />
            Device Management
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Monitor and control the campus IoT sensor fleet
          </p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button onClick={fetchDevices} className="primary-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button 
            onClick={() => {
              setFormData({ id: '', name: '', type: 'ULTRASONIC_SENSOR', location: '' });
              setShowAddModal(true);
            }}
            className="primary-button" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-teal)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Plus size={16} /> Add Device
          </button>
        </div>
      </div>

      {/* FLEET OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {[
          { label: 'Total Fleet', value: totalDevs, icon: Server, color: 'var(--text-main)' },
          { label: 'Online Nodes', value: onlineDevs, icon: Wifi, color: 'var(--status-green)' },
          { label: 'Offline', value: offlineDevs, icon: WifiOff, color: 'var(--status-red)' },
          { label: 'Needs Attention', value: warningDevs, icon: AlertTriangle, color: 'var(--status-yellow)' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-panel-hover)', borderRadius: '8px' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{loading ? '-' : stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* LEFT COMPONENT: DATA GRID */}
        <div className="glass-panel" style={{ flex: selectedDevice ? 2 : 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'flex 0.3s ease' }}>
          
          {/* Toolbar */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search Device ID or Location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  backgroundColor: 'var(--bg-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <Filter size={14} /> Filter
            </button>
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-panel)', zIndex: 1, borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Device ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Location</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Power</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Last Ping</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length > 0 ? filteredDevices.map(device => {
                  const battery = device.batteryLevel ?? 0;
                  return (
                  <tr 
                    key={device.id} 
                    onClick={() => setSelectedDevice(device)}
                    style={{ 
                      borderBottom: '1px solid var(--border-color)', 
                      cursor: 'pointer',
                      backgroundColor: selectedDevice?.id === device.id ? 'var(--bg-panel-active)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-panel-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedDevice?.id === device.id ? 'var(--bg-panel-active)' : 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{device.name || device.id}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        backgroundColor: getStatusBg(device.status),
                        color: getStatusColor(device.status),
                        display: 'inline-block'
                      }}>
                        {device.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{device.location || 'Unassigned'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{device.type}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {battery <= 20 ? <BatteryWarning size={16} color="var(--status-red)" /> : <Battery size={16} color={battery === 100 ? 'var(--primary-teal)' : 'var(--text-main)'} />}
                      <span style={{ fontSize: '0.85rem', color: battery <= 20 ? 'var(--status-red)' : 'var(--text-main)', fontWeight: 500 }}>
                        {device.batteryLevel !== null ? `${battery}%` : 'AC Power'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{device.lastSeen || 'Never'}</td>
                  </tr>
                )}) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {loading ? 'Discovering Devices...' : 'No devices found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COMPONENT: DETAIL DRAWER */}
        {selectedDevice && (
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out' }}>
            
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--text-main)' }}>{selectedDevice.name || selectedDevice.id}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {selectedDevice.id}</span>
              </div>
              <button 
                onClick={() => setSelectedDevice(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Identity & Status */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Status</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: getStatusColor(selectedDevice.status) }}>{selectedDevice.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}><MapPin size={12} style={{marginRight: '4px'}}/>Location</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{selectedDevice.location || 'Unassigned'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}><Clock size={12} style={{marginRight: '4px'}}/>Uptime</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{calculateUptime(selectedDevice.registeredAt)} hrs</div>
                  </div>
                </div>
              </div>

              {/* Network & Power Diagnostics */}
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 600 }}>Diagnostics</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Firmware</span>
                    <span style={{ color: 'var(--text-main)' }}>{selectedDevice.firmwareVersion || 'Unknown'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hardware Health</span>
                    <span style={{ color: selectedDevice.health === 'CRITICAL' ? 'var(--status-red)' : 'var(--status-green)' }}>{selectedDevice.health}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sensors</span>
                    <span style={{ color: 'var(--text-main)' }}>{selectedDevice.sensors && selectedDevice.sensors.length > 0 ? selectedDevice.sensors.join(', ') : 'Default'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                onClick={openEditModal}
                style={{ 
                flex: 1, 
                padding: '0.75rem', 
                backgroundColor: 'var(--bg-panel)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-main)', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '100px'
              }}>
                <Edit2 size={14} /> Edit
              </button>

              {selectedDevice.status !== 'MAINTENANCE' ? (
                <button 
                  onClick={() => handleStatusUpdate(selectedDevice.id, 'MAINTENANCE')}
                  style={{ 
                  flex: 1, 
                  padding: '0.75rem', 
                  backgroundColor: 'var(--bg-panel-hover)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--status-yellow)', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '100px'
                }}>
                  Maintenance
                </button>
              ) : (
                <button 
                  onClick={() => handleStatusUpdate(selectedDevice.id, 'ONLINE')}
                  style={{ 
                  flex: 1, 
                  padding: '0.75rem', 
                  backgroundColor: 'var(--bg-panel-hover)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--status-green)', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '100px'
                }}>
                  Mark Online
                </button>
              )}
              
              <button 
                onClick={() => handleDeleteDevice(selectedDevice.id)}
                style={{ 
                flex: 1, 
                padding: '0.75rem', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--status-red)', 
                color: 'var(--status-red)', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '100px'
              }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>

          </div>
        )}
      </div>

      {/* MODALS */}
      {(showAddModal || showEditModal) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-panel)' }}>
            <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.25rem' }}>
              {showAddModal ? 'Add New Device' : 'Edit Device'}
            </h2>
            
            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* ID Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Device ID (e.g. MAC / Serial)</label>
                <input 
                  required
                  disabled={showEditModal}
                  value={formData.id}
                  onChange={e => setFormData({...formData, id: e.target.value})}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', opacity: showEditModal ? 0.6 : 1 }}
                />
              </div>

              {/* Name Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)' }}
                />
              </div>

              {/* Type Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)' }}
                >
                  <option value="ULTRASONIC_SENSOR">Ultrasonic Sensor</option>
                  <option value="CAMERA">Camera</option>
                  <option value="THERMAL_SENSOR">Thermal Sensor</option>
                  <option value="GATEWAY">Gateway</option>
                  <option value="RFID_READER">RFID Reader</option>
                </select>
              </div>

              {/* Location Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location (Building / Floor / Room)</label>
                <input 
                  required
                  placeholder="e.g. ATB / floor_1 / Canteen"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: '0.5rem', background: 'var(--primary-teal)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeviceManagementPage;
