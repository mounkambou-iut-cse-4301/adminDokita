import config from "src/config/config.dev";
import { create } from "zustand";

interface addCategoriestate {
  addVideo: (input: any) => Promise<void>;
  addVideoResponse: any | null;
  loading: boolean;
}

const useAddessaddVideo = create<addCategoriestate>((set) => ({
  addVideoResponse: null,
  loading: false,

  addVideo: async (input) => {
    const token = localStorage.getItem("token");
    set({ loading: true });

    try {
      const response = await fetch(
        `${config.mintClient}videos/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(input), // ✅ Envoi JSON direct
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add formation: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addVideoResponse: data, loading: false });
    } catch (error) {
      console.error("Error adding formation:", error);
      set({ loading: false });
    }
  },
}));

export default useAddessaddVideo;
