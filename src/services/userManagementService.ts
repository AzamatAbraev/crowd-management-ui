import { api } from '../server';

export interface KeycloakUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  roles: string[];
}

export interface CreateUserPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  temporaryPassword: boolean;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  temporary: boolean;
}

const unwrap = (response: any) => response.data?.data ?? response.data;

export const userManagementService = {
  getAllUsers: async (): Promise<KeycloakUser[]> => {
    const response = await api.get('admin/users');
    return unwrap(response) ?? [];
  },

  searchUsers: async (query: string): Promise<KeycloakUser[]> => {
    const response = await api.get('admin/users', { params: { search: query } });
    return unwrap(response) ?? [];
  },

  getUserById: async (userId: string): Promise<KeycloakUser> => {
    const response = await api.get(`admin/users/${userId}`);
    return unwrap(response);
  },

  createUser: async (payload: CreateUserPayload): Promise<string> => {
    const response = await api.post('admin/users', payload);
    return unwrap(response)?.id;
  },

  updateUser: async (userId: string, payload: UpdateUserPayload): Promise<void> => {
    await api.put(`admin/users/${userId}`, payload);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`admin/users/${userId}`);
  },

  setUserEnabled: async (userId: string, enabled: boolean): Promise<void> => {
    await api.put(`admin/users/${userId}/status`, null, { params: { enabled } });
  },

  resetPassword: async (userId: string, payload: ResetPasswordPayload): Promise<void> => {
    await api.put(`admin/users/${userId}/password`, payload);
  },

  getUserRoles: async (userId: string): Promise<string[]> => {
    const response = await api.get(`admin/users/${userId}/roles`);
    return unwrap(response) ?? [];
  },

  assignRole: async (userId: string, roleName: string): Promise<void> => {
    await api.post(`admin/users/${userId}/roles/${roleName}`);
  },

  removeRole: async (userId: string, roleName: string): Promise<void> => {
    await api.delete(`admin/users/${userId}/roles/${roleName}`);
  },

  getAllRealmRoles: async (): Promise<string[]> => {
    const response = await api.get('admin/users/roles');
    return unwrap(response) ?? [];
  },
};
