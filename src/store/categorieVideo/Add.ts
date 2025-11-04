import config from "src/config/config.dev";
import { create } from "zustand";
// import { user } from "../parrtial";

interface addCategoriestate {
  addCategoryVideo: (input: any) => Promise<void>;
  addCategoryVideoResponse: any | null;
  loading: boolean;
}

const useAddessaddCategorieVidstore = create<addCategoriestate>((set) => ({
  addCategoryVideoResponse: null,
  loading: false,

  addCategoryVideo: async (input: any) => {
    const token = localStorage.getItem("token");

    set({ loading: true });

    try {
      const response = await fetch(`${config.mintClient}category-videos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // obligatoire pour JSON
        },
        body: JSON.stringify(input), // conversion objet → JSON
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add addCategoryVideo address: ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ addCategoryVideoResponse: data, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding addCategoryVideo address:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
      set({ loading: false });
    }
  },
}));

export default useAddessaddCategorieVidstore;
