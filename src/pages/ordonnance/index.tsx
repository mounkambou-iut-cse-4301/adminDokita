import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/components/ui/table";
import { Badge } from "../../components/components/ui/badge";
import { Switch } from "../../components/components/ui/switch";
import { Button } from "../../components/components/ui/button";
import { Checkbox } from "../../components/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/components/ui/avatar";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CalendarIcon,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { Input } from "../../components/components/ui/input";
import { Textarea } from "../../components/components/ui/textarea";
import { CustomCheckbox } from "../../components/components/ui/customcheck";
import { CustomSwitch } from "../../components/components/ui/customswitch";
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
import TotalLoad from "../../components/components/totalLoad";
import { Label } from "../../components/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import useStoreAllOrdonnances from "src/store/ordonnance/getAll";
import Pagination from "../../components/components/ui/pagination";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "../../components/components/ui/form";
import { Calendar } from "../../components/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "../../components/lib/utils";
import DetailOrdonnance from "./detailMessageStruct";
import useStoreOneOrdonnance from "src/store/ordonnance/getOne";
import axios from "axios";
import config from "src/config/config.dev";

type FilterFormValues = {
  createdAt?: Date;
};

export default function Ordannance() {
  const form = useForm<FilterFormValues>({
    defaultValues: { createdAt: undefined },
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detailCard, setDetailCard] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [idcartes, setIdcartes] = useState("");

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { AllOrdonnances, loadingAllOrdonnances, fetchAllOrdonnances, count } =
    useStoreAllOrdonnances();

  const { OneOrdonnance, loadingOneOrdonnance, fetchOneOrdonnance } =
    useStoreOneOrdonnance();

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [editTraitements, setEditTraitements] = useState<
    Array<{
      name: string;
      voie: string;
      duree: string;
      forme: string;
      dosage: string;
      posologie: string;
    }>
  >([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchAllOrdonnances({ page, limit: 5, q: debouncedSearch });
  }, [page, debouncedSearch, fetchAllOrdonnances]);

  useEffect(() => {
    if (!editOpen || !OneOrdonnance) return;
    if (selectedId && OneOrdonnance.protocoleId !== selectedId) return;

    setEditForm({
      name: OneOrdonnance.name ?? "",
      description: OneOrdonnance.description ?? "",
    });
    setEditTraitements(
      Array.isArray(OneOrdonnance.traitement) ? OneOrdonnance.traitement : []
    );
  }, [editOpen, OneOrdonnance, selectedId]);

  const addTraitement = () => {
    setEditTraitements((prev) => [
      ...prev,
      { name: "", voie: "", duree: "", forme: "", dosage: "", posologie: "" },
    ]);
  };

  const removeTraitement = (index: number) => {
    setEditTraitements((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTraitement = (
    index: number,
    key: "name" | "voie" | "duree" | "forme" | "dosage" | "posologie",
    value: string
  ) => {
    setEditTraitements((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [key]: value } : t))
    );
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setSavingEdit(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      await axios.patch(
        `${config.mintClient}protocoles-ordonance/${selectedId}/`,
        {
          name: editForm.name,
          description: editForm.description,
          traitement: editTraitements,
          images: OneOrdonnance?.images ?? null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchAllOrdonnances({ page, limit: 5, q: debouncedSearch });
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating ordonnance:", error);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }
      await axios.delete(
        `${config.mintClient}protocoles-ordonance/${selectedId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchAllOrdonnances({ page, limit: 5, q: debouncedSearch });
      setIsOpen(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting ordonnance:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loadingAllOrdonnances) {
    return <TotalLoad />;
  }
  console.log("AllOrdonnances", AllOrdonnances);

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex justify-end">
        <div
          className="flex gap-2 items-center bg-primary p-2 rounded-full my-3 cursor-pointer  text-white"
          onClick={() => {
            navigate("/ajouter_ordonnance");
          }}
        >
          <PlusCircle className="w-4 h-4" /> Ajouter une ordonnance
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-lg">Nombre total d'ordonnances</p>

                <p className="text-2xl font-bold">{AllOrdonnances?.length}</p>
              </div>
            </div>{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col  gap-4  p-2">
          <div className="flex items-center justify-between border border-gray-200 p-1 ">
            <p className="text-sm text-muted-foreground">
              +140 ce dernier mois
            </p>

            <Button variant="outline" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/*    <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button> */}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-1 border border-gray-200 p-2 bg-white">
        <div className="relative flex gap-2 ">
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-1 rounded-md bg-white border border-gray-300 focus:outline-none"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />

          <Popover>
            <PopoverTrigger className="flex bg-gray-100 text-left px-4 py-1 text-sm border rounded-md hover:bg-gray-100 gap-1">
              <img
                src="/iconFil.svg"
                // alt="Avatar"
                className="h-6 w-6 rounded-full"
              />{" "}
              <span>date création</span>
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="p-4 space-y-4">
                <Form {...form}>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      // 👉 Quand on clique sur "Réinitialiser"
                      form.reset(); // vide la date
                      fetchAllOrdonnances({
                        page: 1,
                        limit: 6,
                        q: debouncedSearch,
                        createdAt: undefined,
                      });
                      setPage(1);
                    }}
                  >
                    <FormField
                      control={form.control}
                      name="createdAt"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "dd MMMM yyyy", {
                                        locale: fr,
                                      })
                                    : "Choisir une date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                locale={fr}
                                onSelect={(date) => {
                                  // ✅ On met à jour la valeur du formulaire
                                  field.onChange(date);

                                  // ✅ Et on lance automatiquement la requête
                                  const formattedDate = date
                                    ? date.toISOString().split("T")[0]
                                    : undefined;

                                  fetchAllOrdonnances({
                                    page: 1,
                                    limit: 6,
                                    q: debouncedSearch,
                                    createdAt: formattedDate,
                                  });
                                  setPage(1);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </PopoverContent>
          </Popover>
        </div>{" "}
        <button
          className="rounded-full text-white bg-primary"
          onClick={() => {
            fetchAllOrdonnances({ page, limit: 6, q: debouncedSearch });
          }}
        >
          Annuler filtre
        </button>
      </div>

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
            <TableHead>Nom de l’ordonnance</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Médicaments</TableHead>
            <TableHead>Voies d'administration</TableHead>
            <TableHead>Durée du traitement</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {AllOrdonnances?.map((a, i) => (
            <TableRow key={i}>
              <TableCell>
                <CustomCheckbox
                  label=""
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
              </TableCell>

              {/* Nom de l’ordonnance */}
              <TableCell className="font-semibold">{a.name}</TableCell>

              {/* Société pharmaceutique — (pas dans tes données, on peut mettre N/A) */}

              {/* Description */}
              <TableCell>{a.description}</TableCell>

              {/* Médicaments */}
              <TableCell>
                <div className="flex flex-col">
                  {a.traitement?.map((t: any, index: number) => (
                    <span key={index} className="text-sm text-gray-700">
                      • {t.name} ({t.forme}, {t.dosage})
                    </span>
                  ))}
                </div>
              </TableCell>

              {/* Voies d'administration */}
              <TableCell>
                {Array.from(
                  new Set(a.traitement?.map((t: any) => t.voie))
                ).join(", ")}
              </TableCell>

              {/* Durée du traitement (exemple : afficher la durée du premier médicament) */}
              <TableCell>{a.traitement?.[0]?.duree || "—"}</TableCell>

              {/* Actions */}
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
                          setSelectedId(a.protocoleId);
                          fetchOneOrdonnance(String(a.protocoleId));
                          setEditOpen(true);
                        }}
                      >
                        <FaEdit className="text-gray-600 text-lg cursor-pointer" />
                        <span className="font-medium text-gray-500 text-sm hover:text-gray-600">
                          Modifier
                        </span>
                      </li>
                      <li
                        className="flex items-center gap-2 p-2 border-b last:border-none"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDetailCard(true);
                          setIdcartes(String(a.protocoleId));
                        }}
                      >
                        <FaEdit className="text-gray-600 text-lg cursor-pointer" />
                        <span className="font-medium text-gray-500 text-sm hover:text-gray-600">
                          Détail
                        </span>
                      </li>

                      <li
                        className="flex items-center gap-2 p-2 border-b last:border-none"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedId(a.protocoleId);
                          fetchOneOrdonnance(String(a.protocoleId));
                          setIsOpen(true);
                        }}
                      >
                        <FaTrash className="text-red-600 text-lg cursor-pointer" />
                        <span className="font-medium text-red-500 text-sm hover:text-red-600">
                          Supprimer
                        </span>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
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
              <p className="mt-2">
                {"admin.confirm_delete_message"}{" "}
                {OneOrdonnance?.name ? `(${OneOrdonnance.name})` : ""}
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {"admin.cancel"}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={handleDelete}
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
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
        size="full"
        height={80}
      >
        <div className="w-full p-6">
          <h2 className="text-xl font-semibold mb-4">Modifier lâ€™ordonnance</h2>

          {loadingOneOrdonnance ? (
            <div>Chargement...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">MÃ©dicaments</label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addTraitement}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Ajouter
                  </Button>
                </div>

                {editTraitements.map((t, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-3 p-3 border rounded-lg bg-blue-50"
                  >
                    <Input
                      placeholder="Nom"
                      value={t.name}
                      onChange={(e) =>
                        updateTraitement(i, "name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Dosage"
                      value={t.dosage}
                      onChange={(e) =>
                        updateTraitement(i, "dosage", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Forme"
                      value={t.forme}
                      onChange={(e) =>
                        updateTraitement(i, "forme", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Posologie"
                      value={t.posologie}
                      onChange={(e) =>
                        updateTraitement(i, "posologie", e.target.value)
                      }
                    />
                    <Input
                      placeholder="DurÃ©e"
                      value={t.duree}
                      onChange={(e) =>
                        updateTraitement(i, "duree", e.target.value)
                      }
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Voie"
                        value={t.voie}
                        onChange={(e) =>
                          updateTraitement(i, "voie", e.target.value)
                        }
                      />
                      <XCircle
                        onClick={() => removeTraitement(i)}
                        className="w-5 h-5 text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleUpdate} disabled={savingEdit}>
                  {savingEdit ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </TMModal>

      <TMModal
        isOpen={detailCard}
        onClose={() => {
          setDetailCard(false);
          // window.location.reload();
        }}
        // title="Detail carte"
        size="full"
        height={70}
      >
        <DetailOrdonnance idcartes={idcartes} />
      </TMModal>
    </div>
  );
}
