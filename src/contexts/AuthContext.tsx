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
  isAdmin: boolean;
  isManager: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasRole: () => false,
  hasAnyRole: () => false,
  isAdmin: false,
  isManager: false,
  isViewer: true, // Default safe baseline
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
        // Fetch user information from the newly implemented UserController on the Gateway/API
        const response = await api.get('/user/me').catch(() => null);
        
        if (response && response.data) {
           setUser({
               username: response.data.username || response.data.preferred_username || 'Unknown',
               firstName: response.data.firstName || response.data.given_name || 'User',
               lastName: response.data.lastName || response.data.family_name || '',
               roles: response.data.roles || []
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
    // We can still keep a meta 'admin' role bypass just in case
    return user.roles.includes(role) || user.roles.includes('admin'); 
  };
  
  const hasAnyRole = (roles: string[]) => {
      if (!roles || roles.length === 0) return true;
      return roles.some(r => hasRole(r));
  };

  // Determine High-Level Role Groups
  const isAdmin = user?.roles?.includes('admin') || user?.username === 'admin' || false;
  
  // A Manager is someone who isn't purely an admin, but has device or actionable management rights
  const isManager = !isAdmin && (user?.roles?.includes('manage-devices') || user?.roles?.includes('reset-occupancy') || false);
  
  // A Viewer only has read roles and no actionable rights
  const isViewer = !isAdmin && !isManager;


  return (
    <AuthContext.Provider value={{ user, loading, hasRole, hasAnyRole, isAdmin, isManager, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
};
