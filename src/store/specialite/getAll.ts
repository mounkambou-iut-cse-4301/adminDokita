// src/store/useStoreAllSpecialite.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface UserFilters {
  medecinId?: string;
  patientId?: string;
  reservationId?: string;
  page?: number;
  limit?: number;
  q?: string;
  createdAt?: string; // ISO ou format attendu par ton backend
}

interface AllSpecialiteState {
  AllSpecialite: any[];
  count: number;
  loadingAllSpecialite: boolean;
  fetchAllSpecialite: (filters?: UserFilters) => Promise<void>;
}

const useStoreAllSpecialite = create<AllSpecialiteState>((set, get) => ({
  AllSpecialite: [],
  loadingAllSpecialite: false,
  count: 0,

  fetchAllSpecialite: async (filters?: UserFilters) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    set({ loadingAllSpecialite: true });

    const params = new URLSearchParams();
    if (filters) {
      if (filters.medecinId) params.append("medecinId", filters.medecinId);
      if (filters.patientId) params.append("patientId", filters.patientId);
      if (filters.reservationId)
        params.append("reservationId", filters.reservationId);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));
      if (filters.q) params.append("q", filters.q);
      if (filters.createdAt) params.append("createdAt", filters.createdAt);
    }

    try {
      const response = await axios.get(
        `${config.mintClient}specialities/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("response", response.data);
      set({
        AllSpecialite: response.data.items,
        count: response.data.meta.total,
        loadingAllSpecialite: false,
      });
    } catch (error) {
      console.error("Error fetching AllSpecialite:", error);
      set({ loadingAllSpecialite: false });
    }
  },
}));

export default useStoreAllSpecialite;
