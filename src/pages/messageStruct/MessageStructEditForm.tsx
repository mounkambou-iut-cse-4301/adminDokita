import React from "react";
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
import { Checkbox } from "../../components/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { Card, CardContent } from "../../components/components/ui/card";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";

type QuestionType = "TEXT" | "SELECT";

type OptionItem = { id: string; label: string; value: string };

type EditQuestion = {
  id: string;
  label: string;
  type: QuestionType;
  order: number;
  options?: OptionItem[];
  multiple?: boolean;
};

type MessageStructEditFormProps = {
  editTitle: string;
  editDescription: string;
  editQuestions: EditQuestion[];
  savingEdit: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onOpenCreateDialog: () => void;
  onOpenEditDialog: (q: EditQuestion) => void;
  onRemoveQuestion: (id: string) => void;
  onSubmit: () => void;
  editDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
  editingQuestion: EditQuestion | null;
  formLabel: string;
  onFormLabelChange: (value: string) => void;
  formType: QuestionType;
  onFormTypeChange: (value: QuestionType) => void;
  formOptions: OptionItem[];
  onAddOption: () => void;
  onUpdateOption: (id: string, key: "label" | "value", value: string) => void;
  onRemoveOption: (id: string) => void;
  onSaveQuestion: () => void;
  formMultiple: boolean;
  onFormMultipleChange: (value: boolean) => void;
};

export function MessageStructEditForm({
  editTitle,
  editDescription,
  editQuestions,
  savingEdit,
  onTitleChange,
  onDescriptionChange,
  onOpenCreateDialog,
  onOpenEditDialog,
  onRemoveQuestion,
  onSubmit,
  editDialogOpen,
  onEditDialogOpenChange,
  editingQuestion,
  formLabel,
  onFormLabelChange,
  formType,
  onFormTypeChange,
  formOptions,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onSaveQuestion,
  formMultiple,
  onFormMultipleChange,
}: MessageStructEditFormProps) {
  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-2 p-1">
      <h1 className="text-2xl font-bold mb-10 ">
        Formulaire Modification fiche structurÃ©e:
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Titre</Label>
            <Input
              value={editTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Titre du formulaire"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={editDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Description du formulaire"
            />
          </div>

          <Button
            onClick={onOpenCreateDialog}
            className="flex items-center gap-2 text-white"
          >
            <Plus size={14} /> Ajouter une question
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {editQuestions.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucune question ajoutÃ©e pour le moment.
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
                  {q.type === "SELECT" && q.multiple && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                      Multiple
                    </span>
                  )}
                </div>

                {q.type === "SELECT" && q.options?.length ? (
                  <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                    {q.options.map((o) => (
                      <li key={o.id}>{o.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">
                    Pas dâ€™options / champ texte
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenEditDialog(q)}
                  className="flex items-center gap-2"
                >
                  <Edit2 size={14} /> Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onRemoveQuestion(q.id)}
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
        <Button onClick={onSubmit} disabled={savingEdit}>
          {savingEdit && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {savingEdit ? "Modification..." : "Enregistrer le formulaire"}
        </Button>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-4xl w-[90vw] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="bg-white">
              {editingQuestion ? "Modifier la question" : "Ajouter une question"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Label</Label>
              <Input
                value={formLabel}
                onChange={(e) => onFormLabelChange(e.target.value)}
                placeholder="Ex: Depuis quand as-tu le palu ?"
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select onValueChange={(val) => onFormTypeChange(val as QuestionType)}>
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
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formMultiple}
                    onCheckedChange={(value) =>
                      onFormMultipleChange(Boolean(value))
                    }
                  />
                  <Label>Réponses multiples</Label>
                </div>

                <div className="flex items-center justify-between text-white">
                  <Label>Options</Label>
                  <Button size="sm" onClick={onAddOption}>
                    + Ajouter une option
                  </Button>
                </div>

                {formOptions.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Aucune option pour le moment.
                  </p>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 ">
                  {formOptions.map((opt) => (
                    <div key={opt.id} className="flex gap-2 items-center">
                      <Input
                        value={opt.label}
                        onChange={(e) =>
                          onUpdateOption(opt.id, "label", e.target.value)
                        }
                        placeholder="Label (ex: Un jour)"
                        className="w-[750px]"
                      />
                      <Button
                        variant="ghost"
                        onClick={() => onRemoveOption(opt.id)}
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
              onClick={() => onEditDialogOpenChange(false)}
            >
              Annuler
            </Button>
            <Button onClick={onSaveQuestion} disabled={!formLabel.trim()}>
              {editingQuestion ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
