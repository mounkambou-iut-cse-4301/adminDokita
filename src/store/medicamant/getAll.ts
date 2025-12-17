// src/store/useStoreAllMedicamants.ts
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

interface AllMedicamantsState {
  AllMedicamants: any[];
  count: number;
  loadingAllMedicamants: boolean;
  fetchAllMedicamants: (filters?: UserFilters) => Promise<void>;
}

const useStoreAllMedicamants = create<AllMedicamantsState>((set, get) => ({
  AllMedicamants: [],
  loadingAllMedicamants: false,
  count: 0,

  fetchAllMedicamants: async (filters?: UserFilters) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    set({ loadingAllMedicamants: true });

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
        `${
          config.mintClient
        }protocoles-ordonance/medicaments/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response.data);
      set({
        AllMedicamants: response.data.items,
        count: response.data.meta.total,
        loadingAllMedicamants: false,
      });
    } catch (error) {
      console.error("Error fetching AllMedicamants:", error);
      set({ loadingAllMedicamants: false });
    }
  },
}));

export default useStoreAllMedicamants;
