import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Plus, Edit2, Trash2, ShieldCheck, ShieldOff,
  Key, Tag, X, ChevronLeft, CheckCircle, AlertCircle, Loader,
  Mail, User, ChevronRight,
} from 'lucide-react';
import { userManagementService, type KeycloakUser, type CreateUserPayload } from '../../services/userManagementService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

// ─── Constants ───────────────────────────────────────────────────────────────
const SYSTEM_ROLES = ['offline_access', 'uma_authorization', 'default-roles-crowd-management'];

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error';
const Toast: React.FC<{ message: string; type: ToastType; onClose: () => void }> = ({ message, type, onClose }) => (
  <div style={{
    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
    backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
    color: '#fff', padding: '0.85rem 1.5rem', borderRadius: 10,
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontWeight: 600,
    animation: 'fadeIn 0.2s ease',
  }}>
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {message}
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
      <X size={16} />
    </button>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <div className="glass-panel" style={{ width: '100%', maxWidth: 500, padding: '2rem', borderRadius: 16, backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Field Input ─────────────────────────────────────────────────────────────
const FieldInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
    <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} required={required}
      style={{ padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }} />
  </div>
);

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn: React.FC<{ color: string; icon: React.ReactNode; label: string; onClick: () => void; fullWidth?: boolean }> = ({ color, icon, label, onClick, fullWidth }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '0.6rem 1rem', borderRadius: 9, border: 'none', cursor: 'pointer',
    backgroundColor: color + '18', color, fontWeight: 700, fontSize: '0.82rem',
    transition: 'background-color 0.15s', width: fullWidth ? '100%' : undefined,
  }}
    onMouseOver={e => (e.currentTarget.style.backgroundColor = color + '30')}
    onMouseOut={e => (e.currentTarget.style.backgroundColor = color + '18')}
  >
    {icon} {label}
  </button>
);

// ─── User Detail Panel (Right Slide-In) ──────────────────────────────────────
interface DetailPanelProps {
  user: KeycloakUser;
  currentUsername: string | undefined;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleEnabled: () => void;
  onResetPassword: () => void;
  onManageRoles: () => void;
}

const UserDetailPanel: React.FC<DetailPanelProps> = ({
  user, currentUsername, onClose, onEdit, onDelete, onToggleEnabled, onResetPassword, onManageRoles,
}) => {
  const visibleRoles = (user.roles ?? []).filter(r => !SYSTEM_ROLES.includes(r));
  const isSelf = user.username === currentUsername;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, zIndex: 500,
      backgroundColor: 'var(--bg-panel)', borderLeft: '1px solid var(--border-color)',
      display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
      animation: 'slideIn 0.22s ease',
    }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--primary-teal-transparent)', color: 'var(--primary-teal)', fontWeight: 800, fontSize: '1.1rem',
          }}>
            {(user.firstName?.[0] ?? user.username?.[0] ?? '?').toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              {user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : user.username}
              {isSelf && <span style={{ marginLeft: 6, fontSize: '0.65rem', color: 'var(--primary-teal)', fontWeight: 700, verticalAlign: 'middle' }}>YOU</span>}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{user.username}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Info */}
        <section>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: <User size={14} />, label: 'Username', value: user.username },
              { icon: <Mail size={14} />, label: 'Email', value: user.email || '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.9rem', borderRadius: 8, backgroundColor: 'var(--bg-dark)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status */}
        <section>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Status</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.45rem 1rem', borderRadius: 20, fontWeight: 700, fontSize: '0.8rem', backgroundColor: user.enabled ? '#10b98122' : '#ef444422', color: user.enabled ? '#10b981' : '#ef4444' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: user.enabled ? '#10b981' : '#ef4444' }} />
            {user.enabled ? 'Active' : 'Disabled'}
          </div>
        </section>

        {/* Roles */}
        <section>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Assigned Roles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {visibleRoles.length === 0
              ? <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No custom roles</span>
              : visibleRoles.map(r => (
                <span key={r} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, backgroundColor: r === 'theking' ? 'rgba(245,158,11,0.15)' : 'var(--primary-teal-transparent)', color: r === 'theking' ? '#f59e0b' : 'var(--primary-teal)' }}>
                  {r}
                </span>
              ))
            }
          </div>
        </section>

        {/* User ID (for debugging, subtle) */}
        <section>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>User ID</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-dark)', borderRadius: 6 }}>{user.id}</div>
        </section>
      </div>

      {/* Actions Footer */}
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <ActionBtn color="#3b82f6" icon={<Edit2 size={14} />} label="Edit Profile" onClick={onEdit} />
          <ActionBtn color="#8a9eff" icon={<Tag size={14} />} label="Manage Roles" onClick={onManageRoles} />
          <ActionBtn color="#f59e0b" icon={<Key size={14} />} label="Reset Password" onClick={onResetPassword} />
          <ActionBtn color={user.enabled ? '#ef4444' : '#10b981'} icon={user.enabled ? <ShieldOff size={14} /> : <ShieldCheck size={14} />} label={user.enabled ? 'Disable' : 'Enable'} onClick={onToggleEnabled} />
        </div>
        {!isSelf && (
          <ActionBtn color="#ef4444" icon={<Trash2 size={14} />} label="Delete User" onClick={onDelete} fullWidth />
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
type ModalMode = 'create' | 'edit' | 'password' | 'roles' | null;

const AdminUserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<KeycloakUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allRoles, setAllRoles] = useState<string[]>([]);

  const [selectedUser, setSelectedUser] = useState<KeycloakUser | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({ username: '', firstName: '', lastName: '', email: '', password: '', temporaryPassword: true });
  const [pwdData, setPwdData] = useState({ newPassword: '', temporary: true });
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = searchQuery.trim()
        ? await userManagementService.searchUsers(searchQuery)
        : await userManagementService.getAllUsers();
      setUsers(data);
    } catch {
      showToast('Failed to fetch users', 'error');
    } finally { setLoading(false); }
  }, [searchQuery]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { userManagementService.getAllRealmRoles().then(setAllRoles).catch(() => {}); }, []);

  const openPanel = (u: KeycloakUser) => setSelectedUser(u);
  const closePanel = () => setSelectedUser(null);

  const closeModal = () => setModalMode(null);

  const openEdit = () => {
    if (!selectedUser) return;
    setFormData({ ...formData, username: selectedUser.username, firstName: selectedUser.firstName ?? '', lastName: selectedUser.lastName ?? '', email: selectedUser.email ?? '', password: '', temporaryPassword: true });
    setModalMode('edit');
  };

  const openCreate = () => {
    setFormData({ username: '', firstName: '', lastName: '', email: '', password: '', temporaryPassword: true });
    setModalMode('create');
  };

  const openPassword = () => { setPwdData({ newPassword: '', temporary: true }); setModalMode('password'); };

  const openRoles = async () => {
    if (!selectedUser) return;
    setModalMode('roles');
    try {
      const roles = await userManagementService.getUserRoles(selectedUser.id);
      setUserRoles(roles);
    } catch { showToast('Failed to fetch roles', 'error'); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await userManagementService.createUser(formData as CreateUserPayload);
      showToast('User created', 'success'); closeModal(); fetchUsers();
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to create user', 'error');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!selectedUser) return; setSaving(true);
    try {
      await userManagementService.updateUser(selectedUser.id, { firstName: formData.firstName, lastName: formData.lastName, email: formData.email });
      showToast('User updated', 'success'); closeModal(); fetchUsers();
    } catch { showToast('Failed to update', 'error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedUser || !window.confirm(`Delete "${selectedUser.username}"? This cannot be undone.`)) return;
    try {
      await userManagementService.deleteUser(selectedUser.id);
      showToast('User deleted', 'success'); closePanel(); fetchUsers();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleToggleEnabled = async () => {
    if (!selectedUser) return;
    try {
      await userManagementService.setUserEnabled(selectedUser.id, !selectedUser.enabled);
      showToast(`User ${!selectedUser.enabled ? 'enabled' : 'disabled'}`, 'success');
      // Optimistically update panel user immediately
      setSelectedUser(u => u ? { ...u, enabled: !u.enabled } : u);
      fetchUsers();
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); if (!selectedUser) return; setSaving(true);
    try {
      await userManagementService.resetPassword(selectedUser.id, pwdData);
      showToast('Password reset', 'success'); closeModal();
    } catch { showToast('Failed to reset password', 'error'); } finally { setSaving(false); }
  };

  const handleAssignRole = async (roleName: string) => {
    if (!selectedUser || userRoles.includes(roleName)) return;
    try {
      await userManagementService.assignRole(selectedUser.id, roleName);
      setUserRoles(p => [...p, roleName]);
      showToast(`Role "${roleName}" assigned`, 'success');
    } catch { showToast('Failed to assign role', 'error'); }
  };

  const handleRemoveRole = async (roleName: string) => {
    if (!selectedUser) return;
    try {
      await userManagementService.removeRole(selectedUser.id, roleName);
      setUserRoles(p => p.filter(r => r !== roleName));
      showToast(`Role "${roleName}" removed`, 'success');
    } catch { showToast('Failed to remove role', 'error'); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: 'var(--primary-teal)', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color="#000" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>User Management</h1>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Super Admin · {currentUser?.username}</div>
            </div>
          </div>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--primary-teal)', color: '#fff', border: 'none', borderRadius: 9, padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--primary-teal-hover)')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--primary-teal)')}>
          <Plus size={16} /> New User
        </button>
      </nav>

      {/* Main content — shrinks when panel is open */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginRight: selectedUser ? 380 : 0, transition: 'margin-right 0.22s ease' }}>

        {/* Search bar + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 9, padding: '0.5rem 1rem', flex: 1, maxWidth: 400 }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search users…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem', width: '100%' }} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14} /></button>
            )}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {loading ? 'Loading…' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel-hover)' }}>
                  {['User', 'Email', 'Status', 'Roles', ''].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                      <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading users…
                    </div>
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td></tr>
                ) : users.map((u, i) => {
                  const isSelected = selectedUser?.id === u.id;
                  const visibleRoles = (u.roles ?? []).filter(r => !SYSTEM_ROLES.includes(r));
                  return (
                    <tr key={u.id}
                      onClick={() => isSelected ? closePanel() : openPanel(u)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-teal-transparent)' : i % 2 === 0 ? 'transparent' : 'var(--bg-panel-hover)',
                        cursor: 'pointer', transition: 'background-color 0.15s',
                      }}
                      onMouseOver={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-panel-active)'; }}
                      onMouseOut={e => { if (!isSelected) e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'transparent' : 'var(--bg-panel-hover)'; }}
                    >
                      {/* User cell: avatar + name + username */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--primary-teal-transparent)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                            {(u.firstName?.[0] ?? u.username?.[0] ?? '?').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                              {u.firstName || u.lastName ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : u.username}
                              {u.username === currentUser?.username && <span style={{ marginLeft: 6, fontSize: '0.6rem', color: 'var(--primary-teal)', fontWeight: 700 }}>YOU</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email || '—'}</td>
                      {/* Status badge */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, backgroundColor: u.enabled ? '#10b98122' : '#ef444422', color: u.enabled ? '#10b981' : '#ef4444' }}>
                          {u.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      {/* Role pills (max 2 + overflow count) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          {visibleRoles.slice(0, 2).map(r => (
                            <span key={r} style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, backgroundColor: r === 'theking' ? 'rgba(245,158,11,0.15)' : 'var(--primary-teal-transparent)', color: r === 'theking' ? '#f59e0b' : 'var(--primary-teal)' }}>
                              {r}
                            </span>
                          ))}
                          {visibleRoles.length > 2 && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>+{visibleRoles.length - 2}</span>
                          )}
                          {visibleRoles.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>}
                        </div>
                      </td>
                      {/* Chevron indicator */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <ChevronRight size={16} color="var(--text-muted)" style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Slide-in Detail Panel */}
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          currentUsername={currentUser?.username}
          onClose={closePanel}
          onEdit={openEdit}
          onDelete={handleDelete}
          onToggleEnabled={handleToggleEnabled}
          onResetPassword={openPassword}
          onManageRoles={openRoles}
        />
      )}

      {/* ── Modals ── */}

      {/* Create User */}
      {modalMode === 'create' && (
        <Modal title="Create New User" onClose={closeModal}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FieldInput label="Username" value={formData.username} onChange={v => setFormData(f => ({ ...f, username: v }))} required placeholder="e.g. john.doe" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FieldInput label="First Name" value={formData.firstName} onChange={v => setFormData(f => ({ ...f, firstName: v }))} placeholder="John" />
              <FieldInput label="Last Name" value={formData.lastName} onChange={v => setFormData(f => ({ ...f, lastName: v }))} placeholder="Doe" />
            </div>
            <FieldInput label="Email" type="email" value={formData.email} onChange={v => setFormData(f => ({ ...f, email: v }))} placeholder="john@example.com" />
            <FieldInput label="Password" type="password" value={formData.password} onChange={v => setFormData(f => ({ ...f, password: v }))} required placeholder="Initial password" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={formData.temporaryPassword} onChange={e => setFormData(f => ({ ...f, temporaryPassword: e.target.checked }))} />
              Temporary — user must change on first login
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeModal} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                {saving ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User */}
      {modalMode === 'edit' && selectedUser && (
        <Modal title={`Edit ${selectedUser.username}`} onClose={closeModal}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FieldInput label="First Name" value={formData.firstName} onChange={v => setFormData(f => ({ ...f, firstName: v }))} />
              <FieldInput label="Last Name" value={formData.lastName} onChange={v => setFormData(f => ({ ...f, lastName: v }))} />
            </div>
            <FieldInput label="Email" type="email" value={formData.email} onChange={v => setFormData(f => ({ ...f, email: v }))} />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeModal} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reset Password */}
      {modalMode === 'password' && selectedUser && (
        <Modal title={`Reset Password — ${selectedUser.username}`} onClose={closeModal}>
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FieldInput label="New Password" type="password" value={pwdData.newPassword} onChange={v => setPwdData(p => ({ ...p, newPassword: v }))} required placeholder="Enter new password" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={pwdData.temporary} onChange={e => setPwdData(p => ({ ...p, temporary: e.target.checked }))} />
              Temporary — user must change on next login
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeModal} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: 'none', backgroundColor: '#f59e0b', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                {saving ? 'Resetting…' : 'Reset Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Role Management */}
      {modalMode === 'roles' && selectedUser && (
        <Modal title={`Roles — ${selectedUser.username}`} onClose={closeModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>Current Roles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {userRoles.filter(r => !SYSTEM_ROLES.includes(r)).length === 0
                  ? <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No custom roles assigned</span>
                  : userRoles.filter(r => !SYSTEM_ROLES.includes(r)).map(r => (
                    <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'var(--primary-teal-transparent)', color: 'var(--primary-teal)' }}>
                      {r}
                      <button onClick={() => handleRemoveRole(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-teal)', display: 'flex', padding: 0 }}><X size={12} /></button>
                    </span>
                  ))
                }
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>Available Roles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {allRoles.filter(r => !SYSTEM_ROLES.includes(r) && !userRoles.includes(r)).map(r => (
                  <button key={r} onClick={() => handleAssignRole(r)} style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary-teal)'; e.currentTarget.style.color = 'var(--primary-teal)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    + {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminUserManagementPage;
