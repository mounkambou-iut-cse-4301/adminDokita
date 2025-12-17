import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Textarea } from "../../components/components/ui/textarea";
import { Label } from "../../components/components/ui/label";
import { useToast } from "../../components/hooks/use-toast";
import useMedicamantsFormStore from "src/store/medicamant/Add";

interface Medicament {
  name: string;
  dosage: string;
  forme: string;
  voie: string;
  posologie: string;
  comment: string;

  nameCommercial: string;
  nameLabo: string;
}

interface FormValues {
  medicament: Medicament;
}

const AddMedicament = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitForm, loading, error } = useMedicamantsFormStore();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      medicament: {
        name: "",
        dosage: "",
        forme: "",
        voie: "",
        posologie: "",
        comment: "",

        nameCommercial: "",
        nameLabo: "",
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload = data.medicament;

    try {
      await submitForm(payload);
      toast({
        title: "Médicament ajouté",
        description: "Enregistrement réussi",
      });
      navigate(-1);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez réessayer plus tard",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← Nouveau Médicament
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input placeholder="Nom" {...register("medicament.name")} />
        </div>

        <div className="space-y-2">
          <Label>Nom Commercial</Label>
          <Input
            placeholder="Nom commercial"
            {...register("medicament.nameCommercial")}
          />
        </div>

        <div className="space-y-2">
          <Label>Nom Laboratoire</Label>
          <Input
            placeholder="Nom laboratoire"
            {...register("medicament.nameLabo")}
          />
        </div>

        <div className="space-y-2">
          <Label>Dosage</Label>
          <Input placeholder="Ex : 500mg" {...register("medicament.dosage")} />
        </div>

        <div className="space-y-2">
          <Label>Forme</Label>
          <Input
            placeholder="Ex : comprimé, sirop..."
            {...register("medicament.forme")}
          />
        </div>

        <div className="space-y-2">
          <Label>Voie d'administration</Label>
          <Input
            placeholder="Ex : orale, IV..."
            {...register("medicament.voie")}
          />
        </div>

        <div className="space-y-2">
          <Label>Posologie</Label>
          <Input
            placeholder="Ex : 1 comprimé 3 fois par jour"
            {...register("medicament.posologie")}
          />
        </div>

        <div className="space-y-2">
          <Label>Commentaire</Label>
          <Textarea
            placeholder="Information importante..."
            {...register("medicament.comment")}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full text-white">
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>

        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default AddMedicament;
