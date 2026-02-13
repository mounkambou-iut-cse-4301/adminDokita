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
  CardContent,
} from "../../components/components/ui/card";
import {
  MoreHorizontal,
  PlusCircle,
  Edit2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { CustomCheckbox } from "../../components/components/ui/customcheck";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import TMModal from "../../components/components/ui/TM_Modal";
import DetailMessage from "./detailMessageStruct";
import TotalLoad from "../../components/components/totalLoad";
import { useToast } from "../../components/hooks/use-toast";
import useStoreAllFiche from "src/store/fiche/getAll";
import useStoreOneFiche from "src/store/fiche/getOne";
import Pagination from "../../components/components/ui/pagination";
import config from "src/config/config.dev";
import { Button } from "../../components/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/components/ui/dialog";
import { Input } from "../../components/components/ui/input";
import { Label } from "../../components/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";

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

type QuestionType = "TEXT" | "SELECT";

type OptionItem = { id: string; label: string; value: string };

type EditQuestion = {
  id: string;
  label: string;
  type: QuestionType;
  order: number;
  options?: OptionItem[];
};

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<EditQuestion | null>(
    null,
  );
  const [formLabel, setFormLabel] = useState("");
  const [formType, setFormType] = useState<QuestionType>("TEXT");
  const [formOptions, setFormOptions] = useState<OptionItem[]>([]);

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

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setFormLabel("");
    setFormType("TEXT");
    setFormOptions([]);
    setEditDialogOpen(true);
  };

  const openEditDialog = (q: EditQuestion) => {
    setEditingQuestion(q);
    setFormLabel(q.label);
    setFormType(q.type);
    setFormOptions(q.options ? q.options.map((o) => ({ ...o })) : []);
    setEditDialogOpen(true);
  };

  const saveQuestion = () => {
    if (!formLabel.trim()) return;

    if (editingQuestion) {
      setEditQuestions((prev) =>
        prev.map((p) =>
          p.id === editingQuestion.id
            ? {
                ...p,
                label: formLabel.trim(),
                type: formType,
                options: formType === "SELECT" ? formOptions : [],
              }
            : p,
        ),
      );
    } else {
      const newQ: EditQuestion = {
        id: uid("q_"),
        label: formLabel.trim(),
        type: formType,
        options: formType === "SELECT" ? formOptions : [],
        order: editQuestions.length,
      };
      setEditQuestions((prev) => [...prev, newQ]);
    }

    setEditDialogOpen(false);
  };

  const removeQuestion = (id: string) => {
    setEditQuestions((prev) => prev.filter((p) => p.id !== id));
  };

  const addOption = () => {
    setFormOptions((prev) => [
      ...prev,
      { id: uid("o_"), label: "", value: uid("v_") },
    ]);
  };

  const updateOption = (id: string, key: "label" | "value", value: string) => {
    setFormOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [key]: value } : o)),
    );
  };

  const removeOption = (id: string) => {
    setFormOptions((prev) => prev.filter((o) => o.id !== id));
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
        <HeadlessDialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
            <HeadlessDialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
              <HeadlessDialog.Title className="text-lg font-bold">
                Confirmation de suppression
              </HeadlessDialog.Title>
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
            </HeadlessDialog.Panel>
          </div>
        </HeadlessDialog>
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
        <div className="max-w-5xl mx-auto mt-6 space-y-2 p-1">
          <h1 className="text-2xl font-bold mb-10 ">
            Formulaire Modification fiche structurée:
          </h1>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="grid sm:grid-cols-3 gap-4 items-end">
              <div>
                <Label>Titre</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Titre du formulaire"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description du formulaire"
                />
              </div>

              <Button
                onClick={openCreateDialog}
                className="flex items-center gap-2 text-white"
              >
                <Plus size={14} /> Ajouter une question
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {editQuestions.length === 0 && (
              <p className="text-sm text-gray-500">
                Aucune question ajoutée pour le moment.
              </p>
            )}

            {editQuestions.map((q) => (
              <Card key={q.id} className="p-4">
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-lg">{q.label}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {q.type}
                      </span>
                    </div>

                    {q.type === "SELECT" && q.options?.length ? (
                      <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                        {q.options.map((o) => (
                          <li key={o.id}>{o.label}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400">
                        Pas d’options / champ texte
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => openEditDialog(q)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => removeQuestion(q.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end text-white">
            <Button onClick={handleUpdateFiche} disabled={savingEdit}>
              {savingEdit && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {savingEdit ? "Modification..." : "Enregistrer le formulaire"}
            </Button>
          </div>

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-4xl w-[90vw] max-h-[85vh]">
              <DialogHeader>
                <DialogTitle className="bg-white">
                  {editingQuestion
                    ? "Modifier la question"
                    : "Ajouter une question"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label>Label</Label>
                  <Input
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="Ex: Depuis quand as-tu le palu ?"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    onValueChange={(val) => setFormType(val as QuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">TEXT</SelectItem>
                      <SelectItem value="SELECT">SELECT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formType === "SELECT" && (
                  <div className="border rounded p-3 space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between text-white">
                      <Label>Options</Label>
                      <Button size="sm" onClick={addOption}>
                        + Ajouter une option
                      </Button>
                    </div>

                    {formOptions.length === 0 && (
                      <p className="text-sm text-gray-500">
                        Aucune option pour le moment.
                      </p>
                    )}

                    <div className="space-y-2">
                      {formOptions.map((opt) => (
                        <div key={opt.id} className="flex gap-2 items-center">
                          <Input
                            value={opt.label}
                            onChange={(e) =>
                              updateOption(opt.id, "label", e.target.value)
                            }
                            placeholder="Label (ex: Un jour)"
                          />
                          <Button
                            variant="ghost"
                            onClick={() => removeOption(opt.id)}
                            className="px-2 bg-red-500 text-white"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={saveQuestion} disabled={!formLabel.trim()}>
                  {editingQuestion ? "Enregistrer" : "Ajouter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TMModal>
    </div>
  );
}

function mapQuestionsToEdit(questions: FicheQuestion[]): EditQuestion[] {
  return questions.map((q) => ({
    id: q.id,
    type: q.type as QuestionType,
    label: q.label,
    order: q.order,
    options: (q.options ?? []).map((opt, index) => ({
      id: `${q.id}_opt_${index}`,
      label: opt.label,
      value: opt.value,
    })),
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
        ? (q.options ?? [])
            .map((opt) => ({
              label: opt.label.trim(),
              value: opt.value || `v_${Math.random().toString(36).slice(2, 9)}`,
            }))
            .filter((opt) => opt.label)
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

