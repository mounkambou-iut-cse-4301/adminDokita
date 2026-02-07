import { create } from "zustand";
import axios from "axios";
import config from "src/config/config.dev";

interface VerifyUserState {
  verifyUser: (userId: string | number) => Promise<void>;
}

const useStoreVerifyUser = create<VerifyUserState>(() => ({
  verifyUser: async (userId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available. User might not be authenticated.");
      throw new Error("User is not authenticated");
    }

    try {
      await axios.patch(
        `${config.mintClient}admins/users/${userId}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(`Utilisateur ${userId} verifie avec succes`);
    } catch (error) {
      console.error("Erreur lors de la verification de l'utilisateur :", error);
      throw error;
    }
  },
}));

export default useStoreVerifyUser;
