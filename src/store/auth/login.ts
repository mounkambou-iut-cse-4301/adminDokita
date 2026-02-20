import config from "src/config/config.dev";
import { create } from "zustand";

interface User {
  userId?: number;
  id?: string;
  phone: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: Array<{ roleId: number; name: string; description?: string | null }>;
  permissions?: Array<{
    permissionId: number;
    name: string;
    description?: string | null;
  }>;
}

interface LoginResponse {
  token: string;
  user: User;
  roles?: User["roles"];
  permissions?: User["permissions"];
}

interface LoginUserState {
  loginUser: (input: {
    phone: string;
    password: string;
  }) => Promise<LoginResponse | null>;
  loginUserResponse: LoginResponse | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const useAddessloginUserStore = create<LoginUserState>((set) => ({
  loginUserResponse: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"), // ✅ initialise selon le localStorage

  loginUser: async (input) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${config.mintClient}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Erreur de connexion: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();

      // ✅ Sauvegarde dans Zustand
      set({
        loginUserResponse: data,
        loading: false,
        isAuthenticated: true,
      });

      // ✅ Stockage local
      const mergedUser = {
        ...data.user,
        roles: data.user?.roles ?? data.roles ?? [],
        permissions: data.user?.permissions ?? data.permissions ?? [],
      };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur login:", error.message);
        set({ error: error.message });
      } else {
        console.error("Erreur inconnue");
        set({ error: "Erreur inconnue" });
      }
      set({ loading: false, isAuthenticated: false });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      loginUserResponse: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));

export default useAddessloginUserStore;
