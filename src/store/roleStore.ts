import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";
import type { Permission, Role } from "src/types/admin";

interface RoleFilters {
  q?: string;
  page?: number;
  limit?: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface RoleState {
  roles: Role[];
  selectedRole: Role | null;
  rolePermissions: Permission[];
  pagination: PaginationMeta;
  loadingRoles: boolean;
  loadingRoleDetail: boolean;
  loadingRolePermissions: boolean;
  loadingPermissionUpdate: boolean;
  loadingRoleMutation: boolean;
  error: string | null;
  fetchRoles: (filters?: RoleFilters) => Promise<void>;
  fetchRoleById: (id: string | number) => Promise<void>;
  fetchRolePermissions: (roleId: number | string) => Promise<void>;
  createRole: (payload: { name: string; description?: string }) => Promise<Role | null>;
  updateRole: (
    roleId: number | string,
    payload: { name?: string; description?: string }
  ) => Promise<Role | null>;
  deleteRole: (roleId: number | string) => Promise<void>;
  assignPermissions: (
    roleId: number | string,
    permissionIds: number[],
    permissions?: Permission[]
  ) => Promise<void>;
  removePermissions: (
    roleId: number | string,
    permissionIds: number[]
  ) => Promise<void>;
}

const getAuthToken = () => localStorage.getItem("token");

const extractListResponse = (data: any) => {
  if (!data) {
    return { items: [], meta: { total: 0, page: 1, limit: 10 } };
  }

  if (Array.isArray(data)) {
    return {
      items: data,
      meta: { total: data.length, page: 1, limit: data.length },
    };
  }

  if (Array.isArray(data.data)) {
    return {
      items: data.data,
      meta: {
        total: data?.meta?.total ?? data?.meta?.count ?? data.data.length,
        page: data?.meta?.page ?? 1,
        limit: data?.meta?.limit ?? data.data.length,
      },
    };
  }

  if (Array.isArray(data.items1)) {
    return {
      items: data.items1,
      meta: {
        total: data?.meta?.total ?? data?.meta?.count ?? data.items1.length,
        page: data?.meta?.page ?? 1,
        limit: data?.meta?.limit ?? data.items1.length,
      },
    };
  }

  if (Array.isArray(data.results)) {
    return {
      items: data.results,
      meta: {
        total: data?.count ?? data.results.length,
        page: data?.page ?? 1,
        limit: data?.page_size ?? data.results.length,
      },
    };
  }

  return { items: [], meta: { total: 0, page: 1, limit: 10 } };
};

const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  selectedRole: null,
  rolePermissions: [],
  pagination: { total: 0, page: 1, limit: 10 },
  loadingRoles: false,
  loadingRoleDetail: false,
  loadingRolePermissions: false,
  loadingPermissionUpdate: false,
  loadingRoleMutation: false,
  error: null,

  fetchRoles: async (filters) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loadingRoles: true, error: null });
    const params = new URLSearchParams();
    if (filters?.q) params.set("q", filters.q);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    try {
      const response = await axios.get(
        `${config.mintClient}roles?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { items, meta } = extractListResponse(response.data);
      set({
        roles: items,
        pagination: {
          total: meta.total,
          page: meta.page ?? filters?.page ?? 1,
          limit: meta.limit ?? filters?.limit ?? 10,
        },
        loadingRoles: false,
      });
    } catch (error) {
      set({
        loadingRoles: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement",
      });
    }
  },

  fetchRoleById: async (id) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loadingRoleDetail: true, error: null });
    try {
      const response = await axios.get(
        `${config.mintClient}roles/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ selectedRole: response.data, loadingRoleDetail: false });
    } catch (error) {
      set({
        loadingRoleDetail: false,
        error:
          error instanceof Error ? error.message : "Erreur lors du chargement",
      });
    }
  },

  fetchRolePermissions: async (roleId) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loadingRolePermissions: true, error: null });
    try {
      const response = await axios.get(
        `${config.mintClient}role-permissions/${roleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { items } = extractListResponse(response.data);
      set({ rolePermissions: items, loadingRolePermissions: false });
    } catch (error) {
      set({
        loadingRolePermissions: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement",
      });
    }
  },

  createRole: async (payload) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return null;
    }

    set({ loadingRoleMutation: true, error: null });
    try {
      const response = await axios.post(
        `${config.mintClient}roles`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdRole = response.data as Role;
      set((state) => ({
        roles: [createdRole, ...state.roles],
        loadingRoleMutation: false,
      }));
      return createdRole;
    } catch (error) {
      set({
        loadingRoleMutation: false,
        error:
          error instanceof Error ? error.message : "Erreur lors de la création",
      });
      return null;
    }
  },

  updateRole: async (roleId, payload) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return null;
    }

    set({ loadingRoleMutation: true, error: null });
    try {
      const response = await axios.patch(
        `${config.mintClient}roles/${roleId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedRole = response.data as Role;
      set((state) => ({
        roles: state.roles.map((role) =>
          role.roleId === updatedRole.roleId ? updatedRole : role
        ),
        selectedRole:
          state.selectedRole?.roleId === updatedRole.roleId
            ? updatedRole
            : state.selectedRole,
        loadingRoleMutation: false,
      }));
      return updatedRole;
    } catch (error) {
      set({
        loadingRoleMutation: false,
        error:
          error instanceof Error ? error.message : "Erreur lors de la mise à jour",
      });
      return null;
    }
  },

  deleteRole: async (roleId) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loadingRoleMutation: true, error: null });
    try {
      await axios.delete(`${config.mintClient}roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        roles: state.roles.filter((role) => role.roleId !== Number(roleId)),
        selectedRole:
          state.selectedRole?.roleId === Number(roleId)
            ? null
            : state.selectedRole,
        loadingRoleMutation: false,
      }));
    } catch (error) {
      set({
        loadingRoleMutation: false,
        error:
          error instanceof Error ? error.message : "Erreur lors de la suppression",
      });
    }
  },

  assignPermissions: async (roleId, permissionIds, permissions) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    const previousPermissions = get().rolePermissions;
    set({ loadingPermissionUpdate: true, error: null });
    if (permissions && permissions.length > 0) {
      set((state) => ({
        rolePermissions: [
          ...state.rolePermissions,
          ...permissions.filter(
            (perm) =>
              !state.rolePermissions.some(
                (existing) => existing.permissionId === perm.permissionId
              )
          ),
        ],
      }));
    }

    try {
      await axios.post(
        `${config.mintClient}role-permissions/assign`,
        { roleId, permissionIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loadingPermissionUpdate: false });
    } catch (error) {
      set({ loadingPermissionUpdate: false, rolePermissions: previousPermissions });
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'attribution des permissions",
      });
    }
  },

  removePermissions: async (roleId, permissionIds) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    const previousPermissions = get().rolePermissions;
    set({ loadingPermissionUpdate: true, error: null });
    set((state) => ({
      rolePermissions: state.rolePermissions.filter(
        (perm) => !permissionIds.includes(perm.permissionId)
      ),
    }));

    try {
      await axios.post(
        `${config.mintClient}role-permissions/remove`,
        { roleId, permissionIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loadingPermissionUpdate: false });
    } catch (error) {
      set({ loadingPermissionUpdate: false, rolePermissions: previousPermissions });
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression des permissions",
      });
    }
  },
}));

export default useRoleStore;
