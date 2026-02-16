import React, { useState } from "react";
import { Button } from "../../components/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Card, CardContent } from "../../components/components/ui/card";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import usePaludismeFormStore from "src/store/fiche/add";
import { useNavigate } from "react-router-dom";

type QuestionType = "TEXT" | "SELECT";

type OptionItem = { id: string; label: string; value: string };

type Question = {
  id: string;
  label: string;
  type: QuestionType;
  order: number;
  options?: OptionItem[];
};

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function PaludismeAnamneseBuilder() {
  const { submitForm, loading, response } = usePaludismeFormStore();

  const [title, setTitle] = useState("Nom_maladie");
  const [description, setDescription] = useState("Description_maladie");
  const [questions, setQuestions] = useState<Question[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formType, setFormType] = useState<QuestionType>("TEXT");
  const [formOptions, setFormOptions] = useState<OptionItem[]>([]);

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setFormLabel("");
    setFormType("TEXT");
    setFormOptions([]);
    setDialogOpen(true);
  };

  const openEditDialog = (q: Question) => {
    setEditingQuestion(q);
    setFormLabel(q.label);
    setFormType(q.type);
    setFormOptions(q.options ? q.options.map((o) => ({ ...o })) : []);
    setDialogOpen(true);
  };

  const saveQuestion = () => {
    if (!formLabel.trim()) return;

    if (editingQuestion) {
      setQuestions((prev) =>
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
      const newQ: Question = {
        id: uid("q_"),
        label: formLabel.trim(),
        type: formType,
        options: formType === "SELECT" ? formOptions : [],
        order: questions.length,
      };
      setQuestions((prev) => [...prev, newQ]);
    }

    setDialogOpen(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((p) => p.id !== id));
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

  // ✅ Fonction pour envoyer au backend
  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      createdBy: 5, // ou récupéré dynamiquement via ton store auth
      questions: questions.map((q, idx) => ({
        label: q.label,
        type: q.type,
        order: idx,
        options:
          q.type === "SELECT"
            ? q.options?.map((o) => ({
                label: o.label,
                value: o.value,
              })) || []
            : undefined,
      })),
    };

    console.log("📤 Payload envoyé :", payload);
    await submitForm(payload);
  };

  const navigate = useNavigate();

  return (
    <div className="mt-8 space-y-6 p-4 h-screen">
      <div className="mb-10">
        <h1
          className="text-xl font-semibold mb-4 cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          ← retour
        </h1>
      </div>
      <div className="max-w-5xl mx-auto mt-16 space-y-2 p-1 h-screen">
        <h1 className="text-2xl font-bold mb-10 ">
          Formulaire Ajout fiche structurée:
        </h1>
        {/* 🧾 Header - Titre & Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Titre</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du formulaire"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

        {/* 🧩 Liste des questions */}
        <div className="space-y-3">
          {questions.length === 0 && (
            <p className="text-sm text-gray-500">
              Aucune question ajoutée pour le moment.
            </p>
          )}

          {questions.map((q) => (
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

        {/* 📨 Envoi du formulaire */}
        <div className="flex justify-end text-white">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {loading ? "Envoi..." : "Enregistrer le formulaire"}
          </Button>
        </div>

        {/* ✅ Confirmation après envoi */}
        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">
              ✅ Formulaire enregistré avec succès !
            </p>
          </div>
        )}

        {/* 🪟 Popup pour ajouter/modifier une question */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 ">
                    {" "}
                    {formOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex gap-2 items-center"
                      >
                        <Input
                          value={opt.label}
                          onChange={(e) =>
                            updateOption(opt.id, "label", e.target.value)
                          }
                          placeholder="Label (ex: Un jour)"
                          className="w-[750px]"
                        />
                        {/*  <Input
                          value={opt.value}
                          onChange={(e) =>
                            updateOption(opt.id, "value", e.target.value)
                          }
                          placeholder="Value (ex: 1_jour)"
                          className="w-40"
                        /> */}
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
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={saveQuestion} disabled={!formLabel.trim()}>
                {editingQuestion ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
