"use client";

import { useEffect } from "react";
import useStoreOneSpecialite from "src/store/specialite/getOne";

interface AddSectionProps {
  idcartes: any;
}

const DetailSpecialite: React.FC<AddSectionProps> = ({ idcartes }) => {
  const { OneSpecialite, loadingOneSpecialite, fetchOneSpecialite } =
    useStoreOneSpecialite();

  useEffect(() => {
    if (idcartes) {
      fetchOneSpecialite(idcartes);
    }
  }, [idcartes, fetchOneSpecialite]);

  if (loadingOneSpecialite) return <div>Chargement...</div>;
  if (!OneSpecialite) return <div>Aucune donnée trouvée</div>;

  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">
        Détails de la spécialité
      </h2>

      <div className="space-y-1">
        <h4 className="font-medium text-gray-700">Informations générales</h4>
        <div className="border p-4 rounded-md bg-gray-50 text-sm space-y-2">
          <Info label="Nom" value={OneSpecialite.name} />
          <Info
            label="Prix de consultation (FCFA)"
            value={OneSpecialite.consultationPrice}
          />
          <Info
            label="Dur??e consultation (minutes)"
            value={OneSpecialite.consultationDuration}
          />
          <Info
            label="Forfait mensuel (FCFA)"
            value={OneSpecialite.planMonthAmount}
          />
          <Info
            label="Nombre de consultations"
            value={OneSpecialite.numberOfTimePlanReservation}
          />
          {OneSpecialite.createdAt && (
            <Info
              label="Date de création"
              value={new Date(OneSpecialite.createdAt).toLocaleString()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

export default DetailSpecialite;
