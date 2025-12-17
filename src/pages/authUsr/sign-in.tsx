import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Label } from "../../components/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { useTranslation } from "../../hooks/useTranslation";
import useAddessloginUserStore from "src/store/auth/login";

// shadcn form
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "./../../components/components/ui/form";

type SignInFormValues = {
  phone: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser, loginUserResponse, loading, error } =
    useAddessloginUserStore((state) => state);

  const form = useForm<SignInFormValues>({
    defaultValues: { phone: "", password: "" },
    mode: "onChange",
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      // S'assurer que le numéro commence par +237
      const formattedData = {
        ...data,
        phone: data.phone.startsWith("+237") ? data.phone : `+237${data.phone}`,
      };

      const response = await loginUser(formattedData);
      if (response?.token) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Dokita 🚀",
        });

        navigate("/home");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Numéro ou mot de passe incorrect",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Veuillez réessayer plus tard",
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error,
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Illustration */}
        <div className="bg-white flex items-center justify-center p-6">
          <img
            src="/illusMed.png"
            alt="Illustration médicale"
            className="max-w-full h-auto"
          />
        </div>

        {/* Formulaire */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mb-6">
            <img
              src="/logo.png"
              alt="Avatar"
              className="w-14 h-14 flex items-center"
            />
            <h1 className="text-2xl font-bold text-gray-800">Dokita</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="phone"
                      className="text-gray-800 font-semibold"
                    >
                      Téléphone
                    </Label>
                    <FormControl>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center  pl-3 text-[#1B324F] font-semibold pointer-events-none">
                          +237
                        </span>

                        <Input
                          id="phone"
                          type="tel"
                          placeholder="699 12 34 56"
                          {...field}
                          className="pl-16 pr-4 py-2 w-full bg-white border border-[#1B324F]/30
                   focus:ring-2 focus:ring-[#1B324F] focus:border-[#1B324F]
                   text-gray-900 placeholder-gray-400 rounded-lg shadow-sm
                   transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Mot de passe</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Entrez votre mot de passe"
                          {...field}
                          className="bg-white"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 bg-transparent shadow-none"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bouton */}
              <Button
                type="submit"
                className="w-full text-white rounded-full bg-primary hover:bg-[#1b324f]"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Connexion
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
