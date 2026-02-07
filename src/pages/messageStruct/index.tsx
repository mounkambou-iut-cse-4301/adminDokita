import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { CustomCheckbox } from "../../components/components/ui/customcheck";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
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
import { useToast } from "../../components/hooks/use-toast";
import useStoreAllFiche from "src/store/fiche/getAll";
import useStoreOneFiche from "src/store/fiche/getOne";
import Pagination from "../../components/components/ui/pagination";
import config from "src/config/config.dev";

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

type Fiche = {
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

const PAGE_SIZE = 7;

type EditQuestion = {
  id: string;
  type: string;
  label: string;
  optionsText: string;
  optionsValues: string[];
};

export default function MessageStruct() {
  const [isChecked, setIsChecked] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedFicheId, setSelectedFicheId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editFiche, setEditFiche] = useState<Fiche | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editQuestions, setEditQuestions] = useState<EditQuestion[]>([]);
  const [editResponsesText, setEditResponsesText] = useState("");

  const { AllFiche, loadingAllFiche, fetchAllFiche, count } =
    useStoreAllFiche();
  const { OneFiche, loadingOneFiche, fetchOneFiche } = useStoreOneFiche();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const fetchWithFallback = async (
    ficheId: number,
    init?: RequestInit,
  ): Promise<Response> => {
    const baseUrl = `${config.mintClient}fiches/${ficheId}`;
    const firstTry = await fetch(baseUrl, init);
    if (firstTry.ok || firstTry.status !== 404) return firstTry;
    return fetch(`${baseUrl}/`, init);
  };

  useEffect(() => {
    fetchAllFiche({ page, limit: PAGE_SIZE });
  }, [page, fetchAllFiche]);

  useEffect(() => {
    if (OneFiche && selectedFicheId === OneFiche.ficheId) {
      const fiche = OneFiche as Fiche;
      setEditFiche(fiche);
      setEditQuestions(mapQuestionsToEdit(fiche.questions ?? []));
      setEditResponsesText(mapResponsesToText(fiche.responses ?? []));
    }
  }, [OneFiche, selectedFicheId]);

  const handleOpenDetail = async (ficheId: number) => {
    setSelectedFicheId(ficheId);
    setIsDetailOpen(true);

    try {
      await fetchOneFiche(ficheId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Echec du chargement du detail.",
        variant: "destructive",
      });
    }
  };

  const handleOpenEdit = (fiche: Fiche) => {
    setSelectedFicheId(fiche.ficheId);
    setEditTitle(fiche.title || "");
    setEditDescription(fiche.description || "");
    setEditIsActive(!!fiche.isActive);
    setEditQuestions(mapQuestionsToEdit(fiche.questions ?? []));
    setEditResponsesText(mapResponsesToText(fiche.responses ?? []));
    setEditFiche(fiche);
    setIsEditOpen(true);
    fetchOneFiche(fiche.ficheId).catch(() => {
      toast({
        title: "Erreur",
        description: "Echec du chargement du detail.",
        variant: "destructive",
      });
    });
  };

  const handleUpdateFiche = async () => {
    if (!selectedFicheId) return;
    const token = getToken();

    if (!token) {
      toast({
        title: "Erreur",
        description: "Token manquant.",
        variant: "destructive",
      });
      return;
    }

    setSavingEdit(true);
    try {
      if (!editFiche) {
        throw new Error("Fiche manquante");
      }

      const parsedQuestions = mapEditToQuestions(editQuestions);
      const parsedResponses = mapTextToResponses(editResponsesText);

      const response = await fetchWithFallback(selectedFicheId, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          createdBy: editFiche.createdBy,
          isActive: editIsActive,
          questions: parsedQuestions,
          responses: parsedResponses,
        }),
      });

      if (!response.ok) {
        throw new Error("Echec modification");
      }

      setIsEditOpen(false);
      await fetchAllFiche({ page, limit: PAGE_SIZE });
      toast({
        title: "Succes",
        description: "Fiche modifiee avec succes.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier cette fiche.",
        variant: "destructive",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAskDelete = (ficheId: number) => {
    setSelectedFicheId(ficheId);
    setIsDeleteOpen(true);
  };

  const handleDeleteFiche = async () => {
    if (!selectedFicheId) return;
    const token = getToken();

    if (!token) {
      toast({
        title: "Erreur",
        description: "Token manquant.",
        variant: "destructive",
      });
      return;
    }

    setDeleting(true);
    try {
      const response = await fetchWithFallback(selectedFicheId, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Echec suppression");
      }

      setIsDeleteOpen(false);
      setSelectedFicheId(null);
      await fetchAllFiche({ page, limit: PAGE_SIZE });
      toast({
        title: "Succes",
        description: "Fiche supprimee avec succes.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cette fiche.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loadingAllFiche) {
    return <TotalLoad />;
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex justify-end">
        <div
          className="flex items-center gap-2 bg-primary p-2 rounded-full my-3 cursor-pointer text-white"
          onClick={() => navigate("/ajouter_message")}
        >
          <PlusCircle className="w-4 h-4" /> Ajouter un Message structure
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="text-2xl">Nombre total de Message structure:</p>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            </div>
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
            <TableHead>Description</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Heure de creation</TableHead>
            <TableHead>Nombre de symptomes</TableHead>
            <TableHead>Date de creation</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {AllFiche?.map((fiche: Fiche) => {
            const createdDate = new Date(fiche.createdAt);
            const heure = createdDate.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const date = createdDate.toLocaleDateString("fr-FR");
            const formName =
              fiche.title?.trim() ||
              fiche.description ||
              `Fiche #${fiche.ficheId}`;
            const firstQuestion = fiche.questions?.[0];

            return (
              <TableRow key={fiche.ficheId}>
                <TableCell>
                  <CustomCheckbox
                    label=""
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  {formName}
                </TableCell>
                <TableCell>{fiche.description || "-"}</TableCell>

                <TableCell>{firstQuestion?.label || "-"}</TableCell>
                <TableCell>{heure}</TableCell>
                <TableCell>{fiche.questions?.length || 0}</TableCell>
                <TableCell>{date}</TableCell>

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
                            handleOpenDetail(fiche.ficheId);
                          }}
                        >
                          <FaEye className="text-gray-600 text-lg cursor-pointer" />
                          <span className="font-medium text-gray-500 text-sm hover:text-gray-600 transition-colors duration-200">
                            Detail
                          </span>
                        </li>

                        <li
                          className="flex items-center gap-2 p-2 border-b last:border-none"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenEdit(fiche);
                          }}
                        >
                          <FaEdit className="text-blue-600 text-lg cursor-pointer" />
                          <span className="font-medium text-blue-500 text-sm hover:text-blue-600 transition-colors duration-200">
                            Modifier
                          </span>
                        </li>

                        <li
                          className="flex items-center gap-2 p-2 border-b last:border-none"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAskDelete(fiche.ficheId);
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
            <TableCell colSpan={9}>
              <div className="flex justify-center my-4">
                <Pagination
                  pages={Math.ceil((count || 1) / PAGE_SIZE)}
                  currentPage={page}
                  onPageChange={setPage}
                  rangeLimit={5}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Transition show={isDeleteOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
              <Dialog.Title className="text-lg font-bold">
                Confirmation de suppression
              </Dialog.Title>
              <p className="mt-2">
                Voulez-vous vraiment supprimer cette fiche structuree ?
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={deleting}
                >
                  Annuler
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteFiche}
                  disabled={deleting}
                >
                  {deleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <TMModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
        }}
        size="full"
        height={85}
      >
        <DetailMessage
          ficheDetail={OneFiche as Fiche | null}
          loading={loadingOneFiche}
        />
      </TMModal>

      <TMModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        size="full"
        height={85}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Modifier la fiche</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm bg-white"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Titre"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm bg-white"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={editIsActive}
              onChange={(e) => setEditIsActive(e.target.checked)}
            />
            Actif
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Questions</label>
              <button
                className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                type="button"
                onClick={() =>
                  setEditQuestions((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      type: "TEXT",
                      label: "",
                      optionsText: "",
                      optionsValues: [],
                    },
                  ])
                }
              >
                Ajouter une question
              </button>
            </div>

            {editQuestions.length === 0 && (
              <p className="text-sm text-gray-500">
                Aucune question. Cliquez sur “Ajouter une question”.
              </p>
            )}

            {editQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="border rounded-md p-3 space-y-3 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Question {idx + 1}</p>
                  <button
                    className="text-xs text-red-600 hover:text-red-700"
                    type="button"
                    onClick={() =>
                      setEditQuestions((prev) =>
                        prev.filter((item) => item.id !== q.id),
                      )
                    }
                  >
                    Supprimer
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Type</label>
                  <select
                    className="w-full rounded-md border px-2 py-2 text-sm bg-white"
                    value={q.type}
                    onChange={(e) =>
                      setEditQuestions((prev) =>
                        prev.map((item) =>
                          item.id === q.id
                            ? { ...item, type: e.target.value }
                            : item,
                        ),
                      )
                    }
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="SELECT">SELECT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Libellé</label>
                  <input
                    className="w-full rounded-md border px-2 py-2 text-sm bg-white"
                    value={q.label}
                    onChange={(e) =>
                      setEditQuestions((prev) =>
                        prev.map((item) =>
                          item.id === q.id
                            ? { ...item, label: e.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Texte de la question"
                  />
                </div>

                {q.type === "SELECT" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">
                      Options (une par ligne)
                    </label>
                    <textarea
                      className="w-full rounded-md border px-2 py-2 text-sm font-mono min-h-[100px] bg-white"
                      value={q.optionsText}
                      onChange={(e) =>
                        setEditQuestions((prev) =>
                          prev.map((item) =>
                            item.id === q.id
                              ? { ...item, optionsText: e.target.value }
                              : item,
                          ),
                        )
                      }
                      placeholder={"Option A\nOption B"}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Responses (une reponse par ligne)
            </label>
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm font-mono min-h-[100px] bg-white"
              value={editResponsesText}
              onChange={(e) => setEditResponsesText(e.target.value)}
              placeholder={"Reponse 1\nReponse 2"}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => setIsEditOpen(false)}
              disabled={savingEdit}
            >
              Annuler
            </button>
            <button
              className="bg-primary text-white px-4 py-2 rounded-md"
              onClick={handleUpdateFiche}
              disabled={savingEdit}
            >
              {savingEdit ? "Modification..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </TMModal>
    </div>
  );
}

function mapQuestionsToEdit(questions: FicheQuestion[]): EditQuestion[] {
  return questions.map((q) => ({
    id: q.id,
    type: q.type,
    label: q.label,
    optionsText: (q.options ?? []).map((opt) => opt.label).join("\n"),
    optionsValues: (q.options ?? []).map((opt) => opt.value),
  }));
}

function mapEditToQuestions(questions: EditQuestion[]): FicheQuestion[] {
  return questions.map((q, idx) => ({
    id: q.id,
    type: q.type,
    label: q.label,
    order: idx,
    options:
      q.type === "SELECT"
        ? (q.optionsText || "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((label, index) => ({
              label,
              value:
                q.optionsValues[index] ||
                `v_${Math.random().toString(36).slice(2, 9)}`,
            }))
        : [],
  }));
}

function mapResponsesToText(responses: any[]): string {
  if (!responses || responses.length === 0) return "";
  return responses.map((r) => String(r)).join("\n");
}

function mapTextToResponses(text: string): string[] {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
