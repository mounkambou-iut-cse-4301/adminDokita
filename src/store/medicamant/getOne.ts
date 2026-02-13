// src/store/useStoreOneOrdonnance.ts
import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VehicleState {
  OneOrdonnance: any; // L'état pour stocker les données de véhicules
  loadingOneOrdonnance: boolean; // Nouveau state pour suivre l'état du chargement
  fetchOneOrdonnance: (user_id: string) => Promise<void>; // Fonction pour récupérer les véhicules
}

const useStoreOneOrdonnance = create<VehicleState>((set) => ({
  OneOrdonnance: null,
  loadingOneOrdonnance: false,
  fetchOneOrdonnance: async (user_id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      return;
    }
    set({ loadingOneOrdonnance: true }); // Démarre le chargement
    try {
      const response = await axios.get(
        `${config.mintClient}protocoles-ordonance/medicaments/${user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      set({ OneOrdonnance: response.data.item, loadingOneOrdonnance: false }); // Met à jour les données et arrête le chargement
    } catch (error) {
      console.error("Error fetching OneOrdonnance:", error);
      set({ loadingOneOrdonnance: false }); // Arrête le chargement en cas d'erreur
    }
  },
}));

export default useStoreOneOrdonnance;

