import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PlusCircle, XCircle, Upload } from "lucide-react";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Textarea } from "../../components/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import useStoreAllUsers from "src/store/users/getAll";
import useStoreAllReservation from "src/store/reservation/getAll";
import { useToast } from "../../components/hooks/use-toast";
import useOrdonancesFormStore from "src/store/ordonnance/Add";

interface FormValues {
  name: string;
  description: string;
}

const AddOrdonnance = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const { submitForm, loading, error, response } = useOrdonancesFormStore();

  const [medicaments, setMedicaments] = useState([
    { name: "", dosage: "", forme: "", posologie: "", duree: "", voie: "" },
  ]);
  /*   const [images, setImages] = useState<string[]>([]);
   */
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>();



  const ajouterMedicament = () => {
    setMedicaments([
      ...medicaments,
      { name: "", dosage: "", forme: "", posologie: "", duree: "", voie: "" },
    ]);
  };

  const supprimerMedicament = (index: number) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  };



  const onSubmit = async (data: FormValues) => {
    const payload = {
      name: data.name,
      traitement: medicaments,
      description: data.description,
      /*       images: images,
       */
    };

    console.log("📦 Payload envoyé :", payload);

    try {
      await submitForm(payload);
      toast({
        title: "Ajout ordonnance réussi",
        description: "Bienvenue sur Dokita 🚀",
      });
      console.log("response", response);
      navigate(-1);
    } catch (err: any) {
      console.error("❌ err :", err);
      toast({
        variant: "destructive",
        title: err,
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
        ← Nouvelle Ordonnance
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow space-y-6" 
      >
        {/* Détails du traitement */}
        <div>
          <label className="text-sm font-medium">Nom</label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="ex: ajouter_nom"
                className="mt-1"
              />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Ajoutez la description ..."
                className="mt-1"
              />
            )}
          />
        </div>

        {/* Liste des médicaments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Médicaments</label>
            <Button
              type="button"
              variant="secondary"
              onClick={ajouterMedicament}
              className="flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Ajouter
            </Button>
          </div>

          {medicaments.map((m, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-3 p-3 border rounded-lg bg-blue-50"
            >
              <Input
                placeholder="Nom"
                value={m.name}
                onChange={(e) =>
                  setMedicaments(
                    medicaments.map((x, j) =>
                      j === i ? { ...x, name: e.target.value } : x
                    )
                  )
                }
              />
              <Input
                placeholder="Dosage"
                value={m.dosage}
                onChange={(e) =>
                  setMedicaments(
                    medicaments.map((x, j) =>
                      j === i ? { ...x, dosage: e.target.value } : x
                    )
                  )
                }
              />
              <Input
                placeholder="Forme"
                value={m.forme}
                onChange={(e) =>
                  setMedicaments(
                    medicaments.map((x, j) =>
                      j === i ? { ...x, forme: e.target.value } : x
                    )
                  )
                }
              />
              <Input
                placeholder="Posologie"
                value={m.posologie}
                onChange={(e) =>
                  setMedicaments(
                    medicaments.map((x, j) =>
                      j === i ? { ...x, posologie: e.target.value } : x
                    )
                  )
                }
              />
              <Input
                placeholder="Durée"
                value={m.duree}
                onChange={(e) =>
                  setMedicaments(
                    medicaments.map((x, j) =>
                      j === i ? { ...x, duree: e.target.value } : x
                    )
                  )
                }
              />
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Voie"
                  value={m.voie}
                  onChange={(e) =>
                    setMedicaments(
                      medicaments.map((x, j) =>
                        j === i ? { ...x, voie: e.target.value } : x
                      )
                    )
                  }
                />
                <XCircle
                  onClick={() => supprimerMedicament(i)}
                  className="w-5 h-5 text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full text-white" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer l’ordonnance"}
        </Button>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">❌ {error}</p>
        )}
      </form>
    </div>
  );
};

export default AddOrdonnance;
