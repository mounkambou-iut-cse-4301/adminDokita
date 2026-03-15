import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Label } from "../../components/components/ui/label";

type SpecialiteEditFormProps = {
  loading: boolean;
  saving: boolean;
  values: {
    name: string;
    consultationPrice: number;
    consultationDuration: number;
    planMonthAmount: number;
    numberOfTimePlanReservation: number;
  };
  onChange: (
    key:
      | "name"
      | "consultationPrice"
      | "consultationDuration"
      | "planMonthAmount"
      | "numberOfTimePlanReservation",
    value: string,
  ) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function SpecialiteEditForm({
  loading,
  saving,
  values,
  onChange,
  onCancel,
  onSubmit,
}: SpecialiteEditFormProps) {
  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Modifier la spécialité</h2>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Nom de la spécialité</Label>
            <Input
              value={values.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Prix de consultation (FCFA)</Label>
            <Input
              type="number"
              value={values.consultationPrice}
              onChange={(e) => onChange("consultationPrice", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Durée de la consultation (minutes)</Label>
            <Input
              type="number"
              value={values.consultationDuration}
              onChange={(e) =>
                onChange("consultationDuration", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Montant du forfait mensuel (FCFA)</Label>
            <Input
              type="number"
              value={values.planMonthAmount}
              onChange={(e) => onChange("planMonthAmount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Nombre de consultations incluses</Label>
            <Input
              type="number"
              value={values.numberOfTimePlanReservation}
              onChange={(e) =>
                onChange("numberOfTimePlanReservation", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button onClick={onSubmit} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
