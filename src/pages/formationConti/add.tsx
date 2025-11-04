import React, { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from "react-hook-form";
import { Input } from "../../components/components/ui/input";
import { Button } from "../../components/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/components/ui/form";
import { Textarea } from "../../components/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { useToast } from "../../components/hooks/use-toast";
import useAddessaddCategoriestore from "src/store/formation/Add";
import useStoreCategories from "src/store/categorie/getAll";
import { Navigate, useNavigate } from "react-router-dom";

type Lesson = {
  title: string;
  description: string;
  fileUrl: File | null;
  orderIndex: number;
  categoryId: number;
};

type FormValues = {
  name: string;
  categoryId: number;
  competence: string;
  dureeHeures: number;
  comment: string;
  lessons: Lesson[];
};

const AddFormation = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      categoryId: 0,
      competence: "",
      dureeHeures: 0,
      comment: "",
      lessons: [
        {
          title: "",
          description: "",
          fileUrl: null,
          orderIndex: 1,
          categoryId: 0,
        },
      ],
    },
  });

  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessons",
  });

  const { addFormation, loading } = useAddessaddCategoriestore();
  const { toast } = useToast();
  const { Categories, fetchCategories } = useStoreCategories();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Validation locale rapide
      if (
        !data.name.trim() ||
        !data.competence.trim() ||
        data.dureeHeures < 1
      ) {
        toast({
          variant: "destructive",
          title: "Champs invalides",
          description:
            "Veuillez remplir tous les champs obligatoires et entrer une durée valide.",
        });
        return;
      }

      // 🔸 Convertir les fichiers en base64 si présents
      const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });

      const lessonsWithBase64 = await Promise.all(
        data.lessons.map(async (lesson) => {
          let fileContent = null;

          if (lesson.fileUrl instanceof File) {
            fileContent = await convertToBase64(lesson.fileUrl);
          } else if (typeof lesson.fileUrl === "string") {
            // Si c’est déjà une URL (lien direct)
            fileContent = lesson.fileUrl;
          }

          return {
            ...lesson,
            fileUrl: fileContent, // base64 ou URL
          };
        })
      );

      const payload = {
        ...data,
        lessons: lessonsWithBase64,
      };

      await addFormation(payload);

      toast({
        title: "Formation ajoutée ✅",
        description:
          "Votre formation continue a été enregistrée avec succès 🚀",
      });

      navigate("/formation");

      methods.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Impossible d’ajouter la formation. Vérifiez les champs et réessayez.",
      });
    }
  };

  return (
    <div className="p-6">
      <h1
        className="text-xl font-semibold mb-4 cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      >
        ← retour
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle formation continue</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* 🧩 Section : Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom de la formation */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la formation</FormLabel>
                      <FormControl>
                        <Input placeholder="ECG avancé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Catégorie */}
                <FormField
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? String(field.value) : ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {Categories?.map((cat: any) => (
                              <SelectItem
                                key={cat.categoryId}
                                value={String(cat.categoryId)}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Compétence */}
                <FormField
                  control={control}
                  name="competence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compétence</FormLabel>
                      <FormControl>
                        <Input placeholder="Interprétation ECG" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Durée */}
                <FormField
                  control={control}
                  name="dureeHeures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (heures)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Commentaire */}
              <FormField
                control={control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Session pratique..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🧠 Section : Leçons */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Leçons</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        title: "",
                        description: "",
                        fileUrl: null,
                        orderIndex: fields.length + 1,
                        categoryId: 0,
                      })
                    }
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Ajouter une leçon
                  </Button>
                </div>

                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="border p-5 rounded-xl shadow-sm space-y-4 bg-white dark:bg-gray-900"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Titre */}
                      <FormField
                        control={control}
                        name={`lessons.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titre</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Introduction à l’ECG"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Ordre */}
                      <FormField
                        control={control}
                        name={`lessons.${index}.orderIndex`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordre de la vidéo</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={control}
                      name={`lessons.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Bases théoriques..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fichier & Catégorie */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        control={control}
                        name={`lessons.${index}.fileUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fichier / Vidéo</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.files ? e.target.files[0] : null
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`lessons.${index}.categoryId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                value={field.value ? String(field.value) : ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Categories?.map((cat: any) => (
                                    <SelectItem
                                      key={cat.categoryId}
                                      value={String(cat.categoryId)}
                                    >
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-3"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer cette leçon
                    </Button>
                  </div>
                ))}
              </div>

              {/* Bouton de soumission */}
              <Button type="submit" className="w-full text-white mt-6" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer la formation"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFormation;
