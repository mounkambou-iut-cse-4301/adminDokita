import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/components/ui/form";
import { Input } from "../../components/components/ui/input";
import { Textarea } from "../../components/components/ui/textarea";
import { Button } from "../../components/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/components/ui/select";
import { CircleAlert, PlusCircle } from "lucide-react";
import useAddessaddVideo from "src/store/video/Add";
import useStoreCategoriesVid from "src/store/categorieVideo/getAll";
import useStoreAllUsers from "src/store/users/getAll";

// ✅ Validation du formulaire
const videoSchema = z.object({
  title: z.string().min(2, "Le titre est requis"),
  path: z.string().url("Le lien doit être une URL valide"),
  description: z.string().optional(),
  categoryVideoId: z.string().min(1, "La catégorie est requise"),
  medecinId: z.string().min(1, "Le médecin est requis"),
});

type VideoFormValues = z.infer<typeof videoSchema>;

const AddVideo = () => {
  const navigate = useNavigate();

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      path: "",
      description: "",
      categoryVideoId: "",
      medecinId: "",
    },
  });

  const { addVideo, loading } = useAddessaddVideo();
  const { CategoriesVid, fetchCategoriesVid } = useStoreCategoriesVid();
  const { AllUsers, fetchAllUsers } = useStoreAllUsers();

  useEffect(() => {
    fetchCategoriesVid();
    fetchAllUsers({ userType: "MEDECIN" });
  }, [fetchCategoriesVid, fetchAllUsers]);

  // ✅ Soumission du formulaire
  const onSubmit = async (data: VideoFormValues) => {
    const payload = {
      ...data,
      categoryVideoId: Number(data.categoryVideoId),
      medecinId: Number(data.medecinId),
    };

    console.log("📦 Payload envoyé :", payload);

    try {
      await addVideo(payload);
      // ✅ Redirection après succès
      navigate("/videos"); // <-- change le chemin selon ta route
    } catch (error) {
      console.error("❌ Erreur lors de l’ajout de la vidéo :", error);
    }
  };

  return (
    <div className="h-screen p-4">
      <h1
        className="text-xl font-semibold mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← Nouvelle vidéo
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-sm w-full space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <h2 className="text-lg font-semibold">Vidéo éducative</h2>
            <CircleAlert className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* ✅ Formulaire */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la vidéo</FormLabel>
                  <FormControl>
                    <Input placeholder="ex : ECG – Episode 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lien (path) */}
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien (URL) de la vidéo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://cdn.example.com/medias/ecg1.mp4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brève description de la vidéo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Catégorie */}
            <FormField
              control={form.control}
              name="categoryVideoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CategoriesVid?.map((cat: any) => (
                        <SelectItem
                          key={cat.categoryId}
                          value={String(cat.categoryId)}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Médecin */}
            <FormField
              control={form.control}
              name="medecinId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médecin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un médecin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AllUsers?.map((med: any) => (
                        <SelectItem key={med.userId} value={String(med.userId)}>
                          {med.lastName} {med.firstName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white"
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddVideo;
