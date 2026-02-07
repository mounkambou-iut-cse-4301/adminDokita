import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface OneFicheState {
  OneFiche: any;
  loadingOneFiche: boolean;
  fetchOneFiche: (ficheId: number | string) => Promise<void>;
}

const useStoreOneFiche = create<OneFicheState>((set) => ({
  OneFiche: null,
  loadingOneFiche: false,
  fetchOneFiche: async (ficheId: number | string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    set({ loadingOneFiche: true });
    try {
      const response = await axios.get(
        `${config.mintClient}fiches/${ficheId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({
        OneFiche: response.data?.item ?? response.data,
        loadingOneFiche: false,
      });
    } catch (error) {
      console.error("Error fetching OneFiche:", error);
      set({ OneFiche: null, loadingOneFiche: false });
    }
  },
}));

export default useStoreOneFiche;
