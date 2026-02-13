"use client";

import { useEffect } from "react";
import useStoreOneMedicament from "src/store/medicamant/getOne";

interface AddSectionProps {
  idcartes: any;
}

const DetailOrdonnance: React.FC<AddSectionProps> = ({ idcartes }) => {
  const { OneOrdonnance, loadingOneOrdonnance, fetchOneOrdonnance } =
    useStoreOneMedicament();

  useEffect(() => {
    if (idcartes) {
      fetchOneOrdonnance(idcartes);
    }
  }, [idcartes, fetchOneOrdonnance]);

  if (loadingOneOrdonnance) return <div>Chargement...</div>;
  if (!OneOrdonnance) return <div>Aucune donnée trouvée</div>;

  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Détails du médicament</h2>

      <div className="space-y-1">
        <h4 className="font-medium text-gray-700">Informations générales</h4>
        <div className="border p-4 rounded-md bg-gray-50 text-sm space-y-2">
          <Info label="Nom" value={OneOrdonnance.name} />
          <Info label="Nom commercial" value={OneOrdonnance.nameCommercial} />
          <Info label="Nom laboratoire" value={OneOrdonnance.nameLabo} />
          <Info label="Dosage" value={OneOrdonnance.dosage} />
          <Info label="Forme" value={OneOrdonnance.forme} />
          <Info label="Voie" value={OneOrdonnance.voie} />
          <Info label="Posologie" value={OneOrdonnance.posologie} />
          <Info label="Commentaire" value={OneOrdonnance.comment} />
          <Info
            label="Date de création"
            value={new Date(OneOrdonnance.createdAt).toLocaleString()}
          />
          <Info
            label="Dernière mise à jour"
            value={new Date(OneOrdonnance.updatedAt).toLocaleString()}
          />
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

export default DetailOrdonnance;
