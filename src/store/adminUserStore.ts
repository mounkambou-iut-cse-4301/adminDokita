import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";
import type { Role, User } from "src/types/admin";

interface AdminUserFilters {
  q?: string;
  isBlock?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface AdminUserState {
  admins: User[];
  selectedAdmin: User | null;
  pagination: PaginationMeta;
  loadingList: boolean;
  loadingDetail: boolean;
  loadingCreate: boolean;
  loadingRoleUpdate: boolean;
  error: string | null;
  fetchAdmins: (filters?: AdminUserFilters) => Promise<void>;
  fetchAdminById: (id: string | number) => Promise<void>;
  createAdmin: (payload: {
    firstName: string;
    lastName: string;
    sex: string;
    email: string;
    phone: string;
    password: string;
    isSuperAdmin: boolean;
    roleIds: number[];
  }) => Promise<User | null>;
  assignRoleToUser: (
    userId: number | string,
    roleId: number,
    role?: Role
  ) => Promise<void>;
  removeRoleFromUser: (
    userId: number | string,
    roleId: number
  ) => Promise<void>;
}

const getAuthToken = () => localStorage.getItem("token");

const extractListResponse = (data: any) => {
  if (!data) {
    return { items: [], meta: { total: 0, page: 1, limit: 10 } };
  }

  if (Array.isArray(data)) {
    return { items: data, meta: { total: data.length, page: 1, limit: data.length } };
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

const useAdminUserStore = create<AdminUserState>((set, get) => ({
  admins: [],
  selectedAdmin: null,
  pagination: { total: 0, page: 1, limit: 10 },
  loadingList: false,
  loadingDetail: false,
  loadingCreate: false,
  loadingRoleUpdate: false,
  error: null,

  fetchAdmins: async (filters) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loadingList: true, error: null });
    const params = new URLSearchParams();
    params.set("userType", "ADMIN");
    if (filters?.q) params.set("q", filters.q);
    if (filters?.isBlock !== undefined)
      params.set("isBlock", String(filters.isBlock));
    if (filters?.isVerified !== undefined)
      params.set("isVerified", String(filters.isVerified));
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    try {
      const response = await axios.get(
        `${config.mintClient}users/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { items, meta } = extractListResponse(response.data);
      set({
        admins: items,
        pagination: {
          total: meta.total,
          page: meta.page ?? filters?.page ?? 1,
          limit: meta.limit ?? filters?.limit ?? 10,
        },
        loadingList: false,
      });
    } catch (error) {
      set({
        loadingList: false,
        error:
          error instanceof Error ? error.message : "Erreur lors du chargement",
      });
    }
  },

  fetchAdminById: async (id) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loadingDetail: true, error: null });
    try {
      const response = await axios.get(
        `${config.mintClient}users/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ selectedAdmin: response.data, loadingDetail: false });
    } catch (error) {
      set({
        loadingDetail: false,
        error:
          error instanceof Error ? error.message : "Erreur lors du chargement",
      });
    }
  },

  createAdmin: async (payload) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return null;
    }

    set({ loadingCreate: true, error: null });
    try {
      const response = await axios.post(
        `${config.mintClient}users/signup/admin`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loadingCreate: false });
      return response.data ?? null;
    } catch (error) {
      set({
        loadingCreate: false,
        error:
          error instanceof Error ? error.message : "Erreur lors de la création",
      });
      return null;
    }
  },

  assignRoleToUser: async (userId, roleId, role) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    const previousAdmin = get().selectedAdmin;
    set({ loadingRoleUpdate: true, error: null });
    set((state) => {
      if (!state.selectedAdmin || state.selectedAdmin.userId !== Number(userId)) {
        return {};
      }
      const currentRoles = state.selectedAdmin.roles ?? [];
      if (currentRoles.some((r) => r.roleId === roleId)) {
        return { loadingRoleUpdate: true };
      }
      const nextRoles = [...currentRoles, role].filter(Boolean) as Role[];
      return {
        selectedAdmin: { ...state.selectedAdmin, roles: nextRoles },
      };
    });

    try {
      await axios.post(
        `${config.mintClient}users/${userId}/roles`,
        { roleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loadingRoleUpdate: false });
    } catch (error) {
      set({ loadingRoleUpdate: false, selectedAdmin: previousAdmin });
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'attribution du rôle",
      });
    }
  },

  removeRoleFromUser: async (userId, roleId) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    const previousAdmin = get().selectedAdmin;
    set({ loadingRoleUpdate: true, error: null });
    set((state) => {
      if (!state.selectedAdmin || state.selectedAdmin.userId !== Number(userId)) {
        return {};
      }
      const nextRoles = (state.selectedAdmin.roles ?? []).filter(
        (role) => role.roleId !== roleId
      );
      return {
        selectedAdmin: { ...state.selectedAdmin, roles: nextRoles },
      };
    });

    try {
      await axios.post(
        `${config.mintClient}users/${userId}/roles/remove`,
        { roleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loadingRoleUpdate: false });
    } catch (error) {
      set({ loadingRoleUpdate: false, selectedAdmin: previousAdmin });
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression du rôle",
      });
    }
  },
}));

export default useAdminUserStore;

