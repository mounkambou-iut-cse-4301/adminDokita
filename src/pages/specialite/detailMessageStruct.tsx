"use client";

import { useEffect } from "react";
import { Badge } from "../../components/components/ui/badge";
import { Download, Eye, Trash2 } from "lucide-react";
import useStoreOneOrdonnance from "src/store/ordonnance/getOne";

interface AddSectionProps {
  idcartes: any;
}

const DetailOrdonnance: React.FC<AddSectionProps> = ({ idcartes }) => {
  const { OneOrdonnance, loadingOneOrdonnance, fetchOneOrdonnance } =
    useStoreOneOrdonnance();

  useEffect(() => {
    if (idcartes) {
      fetchOneOrdonnance(idcartes);
    }
  }, [idcartes, fetchOneOrdonnance]);

  if (loadingOneOrdonnance) return <div>Chargement...</div>;
  if (!OneOrdonnance) return <div>Aucune donnée trouvée</div>;

  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Détails de l’ordonnance</h2>

      {/* Nom et description */}
      <div className="space-y-1">
        <h4 className="font-medium text-gray-700">Informations générales</h4>
        <div className="border p-4 rounded-md bg-gray-50 text-sm space-y-2">
          <Info label="Nom de l’ordonnance" value={OneOrdonnance.name} />
          <Info label="Description" value={OneOrdonnance.description} />
          <Info
            label="Date de création"
            value={new Date(OneOrdonnance.createdAt).toLocaleString()}
          />
        </div>
      </div>

      {/* Traitements */}
      <div className="space-y-2 mt-4">
        <h4 className="font-medium text-gray-700">Traitements</h4>

        {OneOrdonnance.traitement?.map((t: any, i: number) => (
          <div
            key={i}
            className="border p-4 rounded-md bg-gray-50 text-sm space-y-2"
          >
            <Info label="Nom" value={t.name} />
            <Info label="Voie" value={t.voie} />
            <Info label="Forme" value={t.forme} />
            <Info label="Dosage" value={t.dosage} />
            <Info label="Posologie" value={t.posologie} />
            <Info label="Durée" value={t.duree} />
          </div>
        ))}
      </div>

      {/* Documents associés  (exemple) */}
      <div className="space-y-2 mt-4">
        <h4 className="font-medium text-gray-700">Documents associés</h4>

        {/* Exemple statique, tu pourras remplacer par tes vrais fichiers */}
        {[{ name: "Ordonnance.pdf" }].map((doc, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 border rounded-md px-4 py-2 text-sm"
          >
            <span className="font-medium">{doc.name}</span>
            <div className="flex gap-2 text-gray-600">
              <Eye className="w-4 h-4 cursor-pointer hover:text-blue-600" />
              <Download className="w-4 h-4 cursor-pointer hover:text-blue-600" />
              <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
            </div>
          </div>
        ))}
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
