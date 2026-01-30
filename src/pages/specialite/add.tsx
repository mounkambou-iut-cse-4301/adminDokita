import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Label } from "../../components/components/ui/label";
import { useToast } from "../../components/hooks/use-toast";
import useSpecialiteFormStore from "src/store/specialite/Add";

/**
 * Données attendues par le backend
 */
interface SpecialiteFormValues {
  name: string;
  consultationPrice: number;
  consultationDuration: number;
  planMonthAmount: number;
  numberOfTimePlanReservation: number;
}

const AddSpecialite = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitForm, loading, error } = useSpecialiteFormStore();

  const { register, handleSubmit } = useForm<SpecialiteFormValues>({
    defaultValues: {
      name: "",
      consultationPrice: 0,
      consultationDuration: 0,
      planMonthAmount: 0,
      numberOfTimePlanReservation: 1,
    },
  });

  const onSubmit = async (data: SpecialiteFormValues) => {
    try {
      await submitForm({
        name: data.name,
        consultationPrice: Number(data.consultationPrice),
        consultationDuration: Number(data.consultationDuration),
        planMonthAmount: Number(data.planMonthAmount),
        numberOfTimePlanReservation: Number(data.numberOfTimePlanReservation),
      });

      toast({
        title: "Spécialité ajoutée",
        description: "Enregistrement réussi",
      });

      navigate(-1);
    } catch {
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
        ← Nouvelle spécialité
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div className="space-y-2">
          <Label>Nom de la spécialité</Label>
          <Input
            placeholder="Ex : Cardiologie"
            {...register("name", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label>Prix de consultation (FCFA)</Label>
          <Input
            type="number"
            placeholder="5000"
            {...register("consultationPrice", {
              valueAsNumber: true,
              min: 0,
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Durée de la consultation (minutes)</Label>
          <Input
            type="number"
            placeholder="30"
            {...register("consultationDuration", {
              valueAsNumber: true,
              min: 1,
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Montant du forfait mensuel (FCFA)</Label>
          <Input
            type="number"
            placeholder="25000"
            {...register("planMonthAmount", {
              valueAsNumber: true,
              min: 0,
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Nombre de consultations incluses</Label>
          <Input
            type="number"
            placeholder="5"
            {...register("numberOfTimePlanReservation", {
              valueAsNumber: true,
              min: 1,
            })}
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

export default AddSpecialite;
