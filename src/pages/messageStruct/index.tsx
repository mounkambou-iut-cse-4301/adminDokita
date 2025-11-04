import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";

import { Button } from "../../components/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";

import { MoreHorizontal, PlusCircle } from "lucide-react";
import { CustomCheckbox } from "../../components/components/ui/customcheck";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch, FaTrash, FaUser } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import TMModal from "../../components/components/ui/TM_Modal";
import DetailMessage from "./detailMessageStruct";
import TotalLoad from "../../components/components/totalLoad";

import useStoreAllFiche from "src/store/fiche/getAll";
import Pagination from "../../components/components/ui/pagination";

export default function MessageStruct() {
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detailCard, setDetailCard] = useState(false);

  const [page, setPage] = useState(1);

  const { AllFiche, loadingAllFiche, fetchAllFiche, count } =
    useStoreAllFiche();

  useEffect(() => {
    fetchAllFiche({ page, limit: 7 });
  }, [page, fetchAllFiche]);

  const navigate = useNavigate();

  if (loadingAllFiche) {
    return <TotalLoad />;
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex justify-end">
        <div
          className="flex items-center gap-2 bg-primary p-2 rounded-full my-3  cursor-pointer  text-white"
          onClick={() => {
            navigate("/ajouter_message");
          }}
        >
          <PlusCircle className="w-4 h-4" /> Ajouter un Message structuré
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-1">
                <p className="text-2xl">Nombre total de Message structuré: </p>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            </div>{" "}
          </CardTitle>
        </CardHeader>
      </Card>

      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>
              <CustomCheckbox
                label=""
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </TableHead>
            <TableHead>Nom du formulaire</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Heure de création</TableHead>
            <TableHead>Nombre de symptômes</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {AllFiche?.map((fiche, i) => {
            const createdDate = new Date(fiche.createdAt);
            const heure = createdDate.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const date = createdDate.toLocaleDateString("fr-FR");

            return (
              <TableRow key={fiche.ficheId}>
                <TableCell>
                  <CustomCheckbox
                    label=""
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </TableCell>

                {/* 🧾 Nom du formulaire */}
                <TableCell className="flex items-center gap-2">
                  {fiche.title}
                </TableCell>

                {/* 🏥 Service (placeholder si non dispo dans les données) */}
                <TableCell className="text-blue-600">
                  Médecine générale
                </TableCell>

                {/* 🕓 Heure de création */}
                <TableCell>{heure}</TableCell>

                {/* 💊 Nombre de symptômes */}
                <TableCell>{fiche.questions?.length || 0}</TableCell>

                {/* 📅 Date de création */}
                <TableCell>{date}</TableCell>

                {/* ⚙️ Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Popover>
                    <PopoverTrigger className="bg-gray-200 text-left px-4 py-1 text-sm border rounded-md hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </PopoverTrigger>
                    <PopoverContent className="p-4 w-full">
                      <ul className="space-y-2 cursor-pointer">
                        <li
                          className="flex items-center gap-2 p-2 border-b last:border-none"
                          onClick={(event) => {
                            event.stopPropagation();
                            console.log("🔍 Voir détail fiche", fiche.ficheId);
                          }}
                        >
                          <FaEdit className="text-gray-600 text-lg cursor-pointer" />
                          <span className="font-medium text-gray-500 text-sm hover:text-gray-600 transition-colors duration-200">
                            Détail
                          </span>
                        </li>

                        <li
                          className="flex items-center gap-2 p-2 border-b last:border-none"
                          onClick={(event) => {
                            event.stopPropagation();
                            console.log("🗑️ Supprimer fiche", fiche.ficheId);
                          }}
                        >
                          <FaTrash className="text-red-600 text-lg cursor-pointer" />
                          <span className="font-medium text-red-500 text-sm hover:text-red-600 transition-colors duration-200">
                            Supprimer
                          </span>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter className="bg-white">
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-center my-4">
                <Pagination
                  pages={Math.ceil((count || 1) / 7)}
                  currentPage={page}
                  onPageChange={setPage}
                  rangeLimit={5}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-lg font-bold">
                {"admin.confirm_delete"}
              </Dialog.Title>
              <p className="mt-2">{"admin.confirm_delete_message"}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {"admin.cancel"}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  //  onClick={handleDeleteUser}
                  // disabled={loadingdeleteUsers}
                >
                  {/*  {loadingdeleteUsers ? t("admin.deleting") : t("admin.delete")} */}{" "}
                  supprimer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <TMModal
        isOpen={detailCard}
        onClose={() => {
          setDetailCard(false);
          // window.location.reload();
        }}
        // title="Detail carte"
        size="md"
        height={70}
      >
        <DetailMessage
        /*   idcartes={idCarte}
          descriptions={descriptions}
          nomCart={nomCart} */
        />
      </TMModal>
    </div>
  );
}
