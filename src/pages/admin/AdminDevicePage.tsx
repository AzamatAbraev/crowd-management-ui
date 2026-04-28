import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, Server, Wifi, WifiOff, Battery, BatteryWarning,
  RefreshCw, Search, Filter, MapPin, Clock, AlertTriangle,
  Plus, Trash2, Edit2, ChevronLeft, X,
} from 'lucide-react';
import type { Device, DeviceStatus, DeviceType } from '../../types/device';
import type { Building } from '../../types/building';
import { deviceService } from '../../services/deviceService';
import { buildingService } from '../../services/buildingService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

const AdminDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [devices, setDevices] = useState<Device[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', type: 'ULTRASONIC_SENSOR', site: 'main_campus', building: '', floor: '', room: '' });

  const fetchDevices = async () => {
    setLoading(true);
    const data = await deviceService.getAllDevices();
    setDevices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
    buildingService.getAllBuildings().then(setBuildings);
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredDevices = devices.filter(d =>
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.name && d.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalDevs = devices.length;
  const onlineDevs = devices.filter(d => d.status === 'ONLINE').length;
  const offlineDevs = devices.filter(d => d.status === 'OFFLINE').length;
  const warningDevs = devices.filter(d => d.status === 'MAINTENANCE' || d.health !== 'GOOD').length;

  const statusColor = (s: DeviceStatus) => ({ ONLINE: 'var(--status-green)', OFFLINE: 'var(--status-red)', MAINTENANCE: 'var(--status-yellow)', DECOMMISSIONED: 'var(--text-muted)' }[s] ?? 'var(--text-muted)');
  const statusBg = (s: DeviceStatus) => ({ ONLINE: 'rgba(16,185,129,0.1)', OFFLINE: 'rgba(239,68,68,0.1)', MAINTENANCE: 'rgba(245,158,11,0.1)', DECOMMISSIONED: 'rgba(100,100,100,0.1)' }[s] ?? 'transparent');

  const calcUptime = (reg: string) => { if (!reg) return 0; return Math.floor((Date.now() - new Date(reg).getTime()) / 3600000); };

  const handleStatusUpdate = async (id: string, state: 'ONLINE' | 'MAINTENANCE') => {
    const updated = await deviceService.updateDeviceStatus(id, state, 'UNKNOWN');
    if (updated) { setDevices(p => p.map(d => d.id === id ? updated : d)); if (selectedDevice?.id === id) setSelectedDevice(updated); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this device? This cannot be undone.')) return;
    const ok = await deviceService.deleteDevice(id);
    if (ok) { setDevices(p => p.filter(d => d.id !== id)); if (selectedDevice?.id === id) setSelectedDevice(null); }
    else alert('Failed to delete device');
  };

  const buildLocation = () => [formData.building, formData.floor, formData.room].filter(Boolean).join(' / ');

  const handleAddSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const nd = await deviceService.createDevice({ id: formData.id, name: formData.name, type: formData.type, location: buildLocation() });
    if (nd) { setDevices(p => [...p, nd]); setShowAddModal(false); setFormData({ id: '', name: '', type: 'ULTRASONIC_SENSOR', site: 'main_campus', building: '', floor: '', room: '' }); }
    else alert('Failed to provision device. It may already exist.');
  };

  const handleEditSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const ud = await deviceService.updateDevice(selectedDevice.id, { name: formData.name, type: formData.type as DeviceType, location: buildLocation() });
    if (ud) { setDevices(p => p.map(d => d.id === ud.id ? ud : d)); setSelectedDevice(ud); setShowEditModal(false); }
    else alert('Failed to update device.');
  };

  const openEdit = () => {
    if (!selectedDevice) return;
    const parts = (selectedDevice.location || '').split(' / ');
    setFormData({ id: selectedDevice.id, name: selectedDevice.name || '', type: selectedDevice.type || 'ULTRASONIC_SENSOR', site: 'main_campus', building: parts[0] || '', floor: parts[1] || '', room: parts[2] || '' });
    setShowEditModal(true);
  };

  return (
    <div style={{ height: '100vh', backgroundColor: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Topbar */}
      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: 'var(--primary-teal)', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={22} color="#000" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Device Management</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>IoT Fleet · {user?.username}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchDevices} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => { setFormData({ id: '', name: '', type: 'ULTRASONIC_SENSOR', site: 'main_campus', building: '', floor: '', room: '' }); setShowAddModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 8, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
            <Plus size={14} /> Add Device
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0, overflow: 'hidden' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {[
            { label: 'Total Fleet', value: totalDevs, icon: Server, color: 'var(--text-main)' },
            { label: 'Online', value: onlineDevs, icon: Wifi, color: 'var(--status-green)' },
            { label: 'Offline', value: offlineDevs, icon: WifiOff, color: 'var(--status-red)' },
            { label: 'Needs Attention', value: warningDevs, icon: AlertTriangle, color: 'var(--status-yellow)' },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 8 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{loading ? '…' : s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main area: table */}
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search ID, name or location…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px 7px 30px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '7px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
                <Filter size={13} /> Filter
              </button>
            </div>
            {/* Table */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-panel)', zIndex: 1, borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    {['Device', 'Status', 'Location', 'Power', 'Last Ping'].map(h => (
                      <th key={h} style={{ padding: '0.85rem 1.25rem', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.length > 0 ? filteredDevices.map(device => {
                    const batt = device.batteryLevel ?? 0;
                    return (
                      <tr key={device.id} onClick={() => setSelectedDevice(device)}
                        style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: selectedDevice?.id === device.id ? 'var(--bg-panel-active)' : 'transparent', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => { if (selectedDevice?.id !== device.id) e.currentTarget.style.backgroundColor = 'var(--bg-panel-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = selectedDevice?.id === device.id ? 'var(--bg-panel-active)' : 'transparent'; }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{device.name || device.id}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, backgroundColor: statusBg(device.status), color: statusColor(device.status) }}>{device.status}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{device.location || 'Unassigned'}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{device.type}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {batt <= 20 ? <BatteryWarning size={15} color="var(--status-red)" /> : <Battery size={15} color={batt === 100 ? 'var(--primary-teal)' : 'var(--text-main)'} />}
                            <span style={{ fontSize: '0.85rem', color: batt <= 20 ? 'var(--status-red)' : 'var(--text-main)' }}>
                              {device.batteryLevel !== null ? `${batt}%` : 'AC'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{device.lastSeen || 'Never'}</td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{loading ? 'Discovering devices…' : 'No devices found.'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Device detail modal */}
      {selectedDevice && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedDevice(null)}>
          <div className="glass-panel" style={{ width: 480, backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.2s ease', maxHeight: '85vh', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.55rem', backgroundColor: statusBg(selectedDevice.status), borderRadius: 8, border: `1px solid ${statusColor(selectedDevice.status)}` }}>
                  <Cpu size={20} color={statusColor(selectedDevice.status)} />
                </div>
                <div>
                  <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>{selectedDevice.name || selectedDevice.id}</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {selectedDevice.id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedDevice(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4 }}><X size={18} /></button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</span>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, backgroundColor: statusBg(selectedDevice.status), color: statusColor(selectedDevice.status) }}>{selectedDevice.status}</span>
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { icon: MapPin, label: 'Location', value: selectedDevice.location || 'Unassigned' },
                  { icon: Clock, label: 'Uptime', value: `${calcUptime(selectedDevice.registeredAt)} hrs` },
                  { icon: Cpu, label: 'Type', value: selectedDevice.type },
                  { icon: selectedDevice.batteryLevel !== null && selectedDevice.batteryLevel <= 20 ? BatteryWarning : Battery, label: 'Power', value: selectedDevice.batteryLevel !== null ? `${selectedDevice.batteryLevel}%` : 'AC' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ padding: '0.9rem', backgroundColor: 'var(--bg-dark)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                      <Icon size={11} /> {label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Last seen */}
              <div style={{ padding: '0.9rem 1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Last Seen</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{selectedDevice.lastSeen || 'Never'}</span>
              </div>

              {/* Firmware */}
              {selectedDevice.firmwareVersion && (
                <div style={{ padding: '0.9rem 1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Firmware</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>{selectedDevice.firmwareVersion}</span>
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.6rem' }}>
              <button onClick={openEdit} style={{ flex: 1, padding: '0.65rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                <Edit2 size={14} /> Edit
              </button>
              {selectedDevice.status !== 'MAINTENANCE' ? (
                <button onClick={() => handleStatusUpdate(selectedDevice.id, 'MAINTENANCE')} style={{ flex: 1, padding: '0.65rem', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid var(--status-yellow)', color: 'var(--status-yellow)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} /> Maintenance
                </button>
              ) : (
                <button onClick={() => handleStatusUpdate(selectedDevice.id, 'ONLINE')} style={{ flex: 1, padding: '0.65rem', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid var(--status-green)', color: 'var(--status-green)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                  <Wifi size={14} /> Mark Online
                </button>
              )}
              <button onClick={() => handleDelete(selectedDevice.id)} style={{ flex: 1, padding: '0.65rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--status-red)', color: 'var(--status-red)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: 420, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'var(--bg-panel)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{showAddModal ? 'Add New Device' : 'Edit Device'}</h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                { label: 'Device ID', key: 'id', disabled: showEditModal, required: true },
                { label: 'Name', key: 'name', required: true },
              ].map(({ label, key, disabled, required }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</label>
                  <input required={required} disabled={disabled} value={(formData as any)[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', opacity: disabled ? 0.6 : 1, outline: 'none' }} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                  style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', outline: 'none' }}>
                  {['ULTRASONIC_SENSOR', 'CAMERA', 'THERMAL_SENSOR', 'GATEWAY', 'RFID_READER'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Site</label>
                <input value={formData.site} onChange={e => setFormData({ ...formData, site: e.target.value })}
                  placeholder="e.g. main_campus"
                  style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Building</label>
                <select required value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })}
                  style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', outline: 'none' }}>
                  <option value="" disabled>Select a building</option>
                  {buildings.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Floor</label>
                  <input value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g. floor_1"
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Room</label>
                  <input value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g. meeting_room"
                    style={{ padding: '0.55rem 0.75rem', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: 7, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.6rem', background: 'var(--primary-teal)', border: 'none', color: '#fff', borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminDevicePage;
