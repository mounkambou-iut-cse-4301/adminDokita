import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/components/ui/form";
import { Input } from "../../components/components/ui/input";
import { Button } from "../../components/components/ui/button";
import { Textarea } from "../../components/components/ui/textarea"; // si tu veux pour description
import { CircleAlert, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/hooks/use-toast";
import useAddessaddCategorieVidstore from "src/store/categorieVideo/Add";

type FormValues = {
  name: string;
  description: string;
};

const AddCategorieVideo = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCategoryVideo, loading } = useAddessaddCategorieVidstore();

  const onSubmit = async (data: FormValues) => {
    try {
      await addCategoryVideo({
        name: data.name,
        description: data.description,
      });

      toast({
        title: "Ajout catégorie réussie",
        description: "Votre catégorie a été ajoutée 🚀",
      });

      navigate("/categorie_video");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie ❌",
      });
      console.error(error);
    }
  };

  return (
    <div className="h-screen p-4">
      <h1
        className="text-xl font-semibold mb-4 cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        ← Nouvelle Catégorie
      </h1>

      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex gap-2 items-center">
            <CardTitle>Nouvelle Catégorie</CardTitle>
            <CircleAlert className="w-5 h-5 text-gray-500" />
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nom */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la catégorie</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: nom_categorie" {...field} />
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
                        placeholder="Décrivez la catégorie..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategorieVideo;
