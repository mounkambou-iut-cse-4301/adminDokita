import config from "src/config/config.dev";
import { create } from "zustand";

interface OrdonancesFormState {
  submitForm: (input: any) => Promise<void>;
  response: any | null;
  loading: boolean;
  error: string;
}

const useOrdonancesFormStore = create<OrdonancesFormState>((set) => ({
  response: null,
  loading: false,
  error: "",

  submitForm: async (input: any) => {
    const token = localStorage.getItem("token");

    set({ loading: true });

    try {
      const response = await fetch(`${config.mintClient}ordonances`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ On envoie du JSON ici
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to submit: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      set({ response: data, loading: false });
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      set({ loading: false });
    }
  },
}));

export default useOrdonancesFormStore;
