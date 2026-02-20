import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";
import type { Permission } from "src/types/admin";

interface PermissionFilters {
  search?: string;
  name?: string;
  page?: number;
  limit?: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface PermissionState {
  permissions: Permission[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  fetchPermissions: (filters?: PermissionFilters) => Promise<void>;
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

const usePermissionStore = create<PermissionState>((set) => ({
  permissions: [],
  pagination: { total: 0, page: 1, limit: 10 },
  loading: false,
  error: null,

  fetchPermissions: async (filters) => {
    const token = getAuthToken();
    if (!token) {
      set({ error: "Utilisateur non authentifié" });
      return;
    }

    set({ loading: true, error: null });
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.name) params.set("name", filters.name);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    try {
      const response = await axios.get(
        `${config.mintClient}permissions?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { items, meta } = extractListResponse(response.data);
      set({
        permissions: items,
        pagination: {
          total: meta.total,
          page: meta.page ?? filters?.page ?? 1,
          limit: meta.limit ?? filters?.limit ?? 10,
        },
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement",
      });
    }
  },
}));

export default usePermissionStore;
