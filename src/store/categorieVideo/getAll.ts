// src/store/useStoreCategoriesVid.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VideoFilters {
  medecinId?: string | number;
  q?: string;
  date?: string; // ISO ou format attendu par ton backend
  page?: number;
  limit?: number;
}

interface CategoriesVidState {
  CategoriesVid: any[];
  count: number;
  loadingCategoriesVid: boolean;
  fetchCategoriesVid: (filters?: VideoFilters) => Promise<void>;
}

const useStoreCategoriesVid = create<CategoriesVidState>((set) => ({
  CategoriesVid: [],
  loadingCategoriesVid: false,
  count: 0,

  fetchCategoriesVid: async (filters?: VideoFilters) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    set({ loadingCategoriesVid: true });

    const params = new URLSearchParams();

    if (filters) {
      if (filters.medecinId)
        params.append("medecinId", String(filters.medecinId));
      if (filters.q) params.append("q", filters.q);
      if (filters.date) params.append("date", filters.date);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));
    }

    try {
      const response = await axios.get(
        `${config.mintClient}category-videos/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        CategoriesVid: response.data.items,
        count: response.data.meta.total,
        loadingCategoriesVid: false,
      });
    } catch (error) {
      console.error("Error fetching CategoriesVid:", error);
      set({ loadingCategoriesVid: false });
    }
  },
}));

export default useStoreCategoriesVid;
