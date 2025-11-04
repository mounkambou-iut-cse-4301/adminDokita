"use client";

import { useState } from "react";

import { Badge } from "../../components/components/ui/badge";
import { Download, Eye, Trash2 } from "lucide-react";

export default function DetailOrdonnance() {
  const documents = [
    { name: "Brief" },
    { name: "Documentation" },
    { name: "Cahier de charge" },
  ];

  return (
    <>
      Détails de message structuré
      {/* Détails du Médecin */}
      <div className="space-y-1">
        <h4 className="font-medium text-gray-700">Détails du Médecin</h4>
        <div className="grid grid-cols-2 text-sm gap-4 border p-4 rounded-md bg-gray-50">
          <Info label="Nom" value="Nana Momo" />
          <Info label="Spécialisation" value="Cardiologist" />
        </div>
      </div>
      {/* Détails de message structuré */}
      <div className="space-y-1">
        <h4 className="font-medium text-gray-700 mt-4">
          Détails de message structuré
        </h4>
        <div className="grid grid-cols-2 text-sm gap-4">
          <div>
            <div className="text-xs text-gray-500">Statut</div>
            <Badge
              //  variant="outline"
              className="text-green-600 border-green-500"
            >
              Active
            </Badge>
          </div>
          <div>
            <div className="text-xs text-gray-500">Date d'expiration</div>
            <span className="text-orange-500 font-medium">15/10/2026</span>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-700 leading-snug space-y-2">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            <span className="text-xs text-gray-500">Durée</span>{" "}
            <span className="font-medium">1 mois</span>
          </p>
        </div>
      </div>
      {/* Paiement */}
      <div className="space-y-1">
        <h4 className="font-medium text-gray-700 mt-4">Paiement</h4>
        <div className="grid grid-cols-2 text-sm gap-4">
          <Info label="Mode de paiement" value="Orange Money" />
          <Info label="Plan" value="19000 FCFA" />
          <Info label="Autre" value="Lorem ipsum" />
        </div>
      </div>
      {/* Documents associés */}
      <div className="space-y-2 mt-4">
        <h4 className="font-medium text-gray-700">Documents associés</h4>
        <div className="space-y-2">
          {documents.map((doc, i) => (
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
    </>
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
