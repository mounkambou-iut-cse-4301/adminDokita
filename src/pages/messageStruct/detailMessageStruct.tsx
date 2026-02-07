"use client";

import { Badge } from "../../components/components/ui/badge";

type FicheOption = {
  label: string;
  value: string;
};

type FicheQuestion = {
  id: string;
  type: string;
  label: string;
  order: number;
  options?: FicheOption[];
};

type FicheDetail = {
  ficheId: number;
  title: string;
  description: string;
  createdBy: number;
  isActive: boolean;
  questions?: FicheQuestion[];
  responses?: any[];
  createdAt: string;
  updatedAt: string;
};

interface DetailMessageProps {
  ficheDetail: FicheDetail | null;
  loading?: boolean;
}

export default function DetailMessage({
  ficheDetail,
  loading = false,
}: DetailMessageProps) {
  if (loading) {
    return <p className="text-sm text-gray-500">Chargement des details...</p>;
  }

  if (!ficheDetail) {
    return <p className="text-sm text-gray-500">Aucun detail disponible.</p>;
  }

  const createdDate = new Date(ficheDetail.createdAt).toLocaleString("fr-FR");
  const updatedDate = new Date(ficheDetail.updatedAt).toLocaleString("fr-FR");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Details du message structure</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info
          label="Titre"
          value={ficheDetail.title?.trim() || `Fiche #${ficheDetail.ficheId}`}
        />
        <Info label="Description" value={ficheDetail.description || "-"} />
        <Info label="Cree par" value={String(ficheDetail.createdBy)} />
        <div>
          <div className="text-xs text-gray-500">Statut</div>
          <Badge
            className={
              ficheDetail.isActive
                ? "text-green-600 border-green-500"
                : "text-red-600 border-red-500"
            }
          >
            {ficheDetail.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <Info label="Date creation" value={createdDate} />
        <Info label="Date mise a jour" value={updatedDate} />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">Questions</h4>
        {!ficheDetail.questions?.length && (
          <p className="text-sm text-gray-500">Aucune question.</p>
        )}

        {ficheDetail.questions?.map((question) => (
          <div
            key={question.id}
            className="border rounded-md p-3 space-y-2 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{question.label}</p>
              <span className="text-xs text-gray-500">
                {question.type} - ordre {question.order}
              </span>
            </div>

            {question.type === "SELECT" && (
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {question.options?.map((option, idx) => (
                  <li key={`${question.id}-${idx}`}>
                    {option.label} ({option.value})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <Info
        label="Nombre de reponses"
        value={String(ficheDetail.responses?.length || 0)}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
