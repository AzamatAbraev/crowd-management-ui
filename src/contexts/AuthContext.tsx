import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../server';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isTheKing: boolean;
  isSystemAdmin: boolean;
  isFacilityManager: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasRole: () => false,
  hasAnyRole: () => false,
  isTheKing: false,
  isSystemAdmin: false,
  isFacilityManager: false,
  isAdmin: false,
  isManager: false,
  isViewer: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me').catch(() => null);
        
        const d = response?.data;
        const resolvedUsername = d?.username || d?.preferred_username;
        if (d && typeof d === 'object' && resolvedUsername) {
          setUser({
            username: resolvedUsername,
            firstName: d.firstName || d.given_name || '',
            lastName: d.lastName || d.family_name || '',
            roles: Array.isArray(d.roles) ? d.roles : [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch user context", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const hasRole = (role: string) => {
    if (!user || (!user.roles)) return false;
    return user.roles.includes(role) || user.roles.includes('admin'); 
  };
  
  const hasAnyRole = (roles: string[]) => {
      if (!roles || roles.length === 0) return true;
      return roles.some(r => hasRole(r));
  };

  const isTheKing = user?.roles?.includes('theking') || false;
  const isSystemAdmin = user?.roles?.includes('system_admin') || false;
  const isFacilityManager = user?.roles?.includes('facility_manager') || false;

  const isAdmin = isTheKing || isSystemAdmin || isFacilityManager || user?.roles?.includes('admin') || user?.username === 'admin' || false;
  
  const isManager = !isAdmin && (user?.roles?.includes('manage-devices') || user?.roles?.includes('reset-occupancy') || false);
  
  const isViewer = !isAdmin && !isManager;


  return (
    <AuthContext.Provider value={{ user, loading, hasRole, hasAnyRole, isTheKing, isSystemAdmin, isFacilityManager, isAdmin, isManager, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
};
