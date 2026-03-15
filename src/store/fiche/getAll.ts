// src/store/useStoreAllFiche.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface UserFilters {
  page?: number;
  limit?: number;
  q?: string;
}

interface AllFicheState {
  AllFiche: any[];
  count: number;
  loadingAllFiche: boolean;
  fetchAllFiche: (filters?: UserFilters) => Promise<void>;
}

const useStoreAllFiche = create<AllFicheState>((set, get) => ({
  AllFiche: [],
  loadingAllFiche: false,
  count: 0,

  fetchAllFiche: async (filters?: UserFilters) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    set({ loadingAllFiche: true });

    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));
      if (filters.q) params.append("q", filters.q);
    }

    try {
      const response = await axios.get(
        `${config.mintClient}fiches/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response.data);
      set({
        AllFiche: response.data.items,
        count: response.data.meta.total,
        loadingAllFiche: false,
      });
    } catch (error) {
      console.error("Error fetching AllFiche:", error);
      set({ loadingAllFiche: false });
    }
  },
}));

export default useStoreAllFiche;
