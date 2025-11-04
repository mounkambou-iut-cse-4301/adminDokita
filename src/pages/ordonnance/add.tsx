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
  reservationId: number;
  dureeTraitement: string;
  comment: string;
}

const AddOrdonnance = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const { AllReservation, fetchAllReservation } = useStoreAllReservation();
  const { submitForm, loading, error, response } = useOrdonancesFormStore();

  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [medicaments, setMedicaments] = useState([
    { name: "", dosage: "", forme: "", posologie: "", duree: "", voie: "" },
  ]);
  const [images, setImages] = useState<string[]>([]);

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>();

  useEffect(() => {
    fetchAllReservation({});
  }, [fetchAllReservation]);

  const ajouterMedicament = () => {
    setMedicaments([
      ...medicaments,
      { name: "", dosage: "", forme: "", posologie: "", duree: "", voie: "" },
    ]);
  };

  const supprimerMedicament = (index: number) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          fileArray.push(reader.result.toString().split(",")[1]); // on garde seulement la base64
          setImages([...images, ...fileArray]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedReservation) return;

    const payload = {
      reservationId: Number(selectedReservation.reservationId),
      medecinId: Number(selectedReservation.medecinId),
      patientId: Number(selectedReservation.patientId),
      dureeTraitement: data.dureeTraitement,
      traitement: medicaments,
      comment: data.comment,
      images: images,
    };

    console.log("📦 Payload envoyé :", payload);

    try {
      await submitForm(payload);
      toast({
        title: "Ajout ordonnance réussi",
        description: "Bienvenue sur Dokita 🚀",
      });
      console.log("response", response);
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
        {/* Sélection de réservation */}
        <Controller
          control={control}
          name="reservationId"
          render={({ field }) => (
            <div>
              <label className="text-sm font-medium">Réservation</label>
              <Select
                onValueChange={(value) => {
                  const reservation = AllReservation.find(
                    (r: any) => r.reservationId === Number(value)
                  );
                  setSelectedReservation(reservation);
                  field.onChange(Number(value));
                }}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Sélectionner une réservation" />
                </SelectTrigger>
                <SelectContent>
                  {AllReservation?.map((r: any) => (
                    <SelectItem
                      key={r.reservationId}
                      value={String(r.reservationId)}
                    >
                      #{r.reservationId} — {r.medecin?.firstName}{" "}
                      {r.medecin?.lastName} 🩺 / {r.patient?.firstName}{" "}
                      {r.patient?.lastName} 📅 {r.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Détails du traitement */}
        <div>
          <label className="text-sm font-medium">Durée du traitement</label>
          <Controller
            control={control}
            name="dureeTraitement"
            render={({ field }) => (
              <Input {...field} placeholder="ex: 7 jours" className="mt-1" />
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

        {/* Commentaire */}
        <div>
          <label className="text-sm font-medium">Commentaire</label>
          <Controller
            control={control}
            name="comment"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Ajoutez un commentaire pour le patient..."
                className="mt-1"
              />
            )}
          />
        </div>

        {/* Upload d'images */}
        <div>
          <label className="text-sm font-medium">Pièces jointes</label>
          <div className="mt-1 flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <Upload className="w-5 h-5 text-gray-500" />
          </div>

          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {images.length} image(s) sélectionnée(s)
            </p>
          )}
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
