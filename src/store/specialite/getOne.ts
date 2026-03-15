// src/store/useStoreOneSpecialite.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface SpecialiteState {
  OneSpecialite: any;
  loadingOneSpecialite: boolean;
  fetchOneSpecialite: (specialiteId: string) => Promise<void>;
}

const useStoreOneSpecialite = create<SpecialiteState>((set) => ({
  OneSpecialite: null,
  loadingOneSpecialite: false,
  fetchOneSpecialite: async (specialiteId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }

    set({ loadingOneSpecialite: true });
    try {
      const response = await axios.get(
        `${config.mintClient}specialities/${specialiteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      set({
        OneSpecialite: response.data.item ?? response.data,
        loadingOneSpecialite: false,
      });
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 404) {
        try {
          const response = await axios.get(
            `${config.mintClient}specialities/${specialiteId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          set({
            OneSpecialite: response.data.item ?? response.data,
            loadingOneSpecialite: false,
          });
          return;
        } catch (retryError) {
          console.error("Error fetching OneSpecialite:", retryError);
        }
      } else {
        console.error("Error fetching OneSpecialite:", error);
      }
      set({ loadingOneSpecialite: false });
    }
  },
}));

export default useStoreOneSpecialite;
