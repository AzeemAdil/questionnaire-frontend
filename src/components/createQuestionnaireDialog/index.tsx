"use client";

import { useState } from "react";
import {
  QuestionInput,
  QuestionOption,
  QuestionType,
  QuestionnaireInput,
} from "@/interfaces";
import { createQuestionnaire } from "@/helpers/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const emptyQuestion: QuestionInput = {
  text: "",
  type: "FREE_TEXT",
};

export default function CreateQuestionnaireDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { ...emptyQuestion },
  ]);

  const mutation = useMutation({
    mutationFn: (data: QuestionnaireInput) => createQuestionnaire(data),
    onSuccess: () => {
      toast.success("Questionnaire created!");
      resetForm();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create questionnaire");
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setQuestions([{ ...emptyQuestion }]);
  };

  const addQuestion = () => {
    setQuestions((q) => [...q, { ...emptyQuestion }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((q) => q.filter((_, i) => i !== idx));
  };

  const updateQuestion = (
    idx: number,
    field: keyof QuestionInput,
    value: string | QuestionOption[]
  ) => {
    setQuestions((q) => {
      const copy = [...q];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const addOption = (qIdx: number, type: "RADIO" | "RANGE") => {
    const opts = questions[qIdx].options || [];
    const newOpt =
      type === "RANGE"
        ? { label: "", minValue: 0, maxValue: 100 }
        : { label: "" };
    updateQuestion(qIdx, "options", [...opts, newOpt]);
  };

  const updateOption = (
    qIdx: number,
    optIdx: number,
    field: keyof QuestionOption,
    value: string | number
  ) => {
    const opts = [...(questions[qIdx].options || [])];
    opts[optIdx] = { ...opts[optIdx], [field]: value };
    updateQuestion(qIdx, "options", opts);
  };

  const removeOption = (qIdx: number, optIdx: number) => {
    const opts = questions[qIdx].options?.filter((_, i) => i !== optIdx) || [];
    updateQuestion(qIdx, "options", opts);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const hasEmpty = questions.some((q) => !q.text.trim());
    if (hasEmpty) {
      toast.error("All questions must have text");
      return;
    }
    const radioRange = questions.filter((q) =>
      ["RADIO", "RANGE"].includes(q.type)
    );
    const missingOpts = radioRange.some(
      (q) => !q.options?.length || q.options.some((o) => !o.label.trim())
    );
    if (missingOpts) {
      toast.error("RADIO and RANGE questions must have at least one option with a label");
      return;
    }

    const payload: QuestionnaireInput = {
      title: title.trim(),
      description: description.trim(),
      questions: questions.map((q) => ({
        text: q.text.trim(),
        type: q.type,
        options:
          q.type !== "FREE_TEXT" && q.options?.length
            ? q.options.map((o) =>
                q.type === "RANGE"
                  ? {
                      label: o.label,
                      minValue: o.minValue ?? 0,
                      maxValue: o.maxValue ?? 100,
                    }
                  : { label: o.label }
              )
            : undefined,
      })),
    };
    mutation.mutate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Questionnaire</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 py-2">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Employee Satisfaction Survey"
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Quarterly feedback"
            fullWidth
            multiline
            rows={2}
          />

          <Typography variant="subtitle1" className="mt-4">
            Questions
          </Typography>

          {questions.map((q, qIdx) => (
            <Box
              key={qIdx}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
            >
              <div className="flex gap-2 items-start">
                <TextField
                  label="Question text"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIdx, "text", e.target.value)}
                  placeholder="Enter your question"
                  fullWidth
                  required
                />
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={q.type}
                    label="Type"
                    onChange={(e) =>
                      updateQuestion(qIdx, "type", e.target.value as QuestionType)
                    }
                  >
                    <MenuItem value="FREE_TEXT">Free Text</MenuItem>
                    <MenuItem value="RADIO">Radio</MenuItem>
                    <MenuItem value="RANGE">Range</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  color="error"
                  onClick={() => removeQuestion(qIdx)}
                  disabled={questions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </div>

              {(q.type === "RADIO" || q.type === "RANGE") && (
                <div className="pl-4 space-y-2">
                  <Typography variant="caption" color="textSecondary">
                    Options
                  </Typography>
                  {(q.options || []).map((opt, optIdx) => (
                    <div key={optIdx} className="flex gap-2 items-center">
                      <TextField
                        size="small"
                        label="Label"
                        value={opt.label}
                        onChange={(e) =>
                          updateOption(qIdx, optIdx, "label", e.target.value)
                        }
                        placeholder={
                          q.type === "RADIO" ? "e.g. Male" : "e.g. 60k - 80k"
                        }
                        className="flex-1"
                      />
                      {q.type === "RANGE" && (
                        <>
                          <TextField
                            size="small"
                            type="number"
                            label="Min"
                            value={opt.minValue ?? ""}
                            onChange={(e) =>
                              updateOption(
                                qIdx,
                                optIdx,
                                "minValue",
                                Number(e.target.value) || 0
                              )
                            }
                            sx={{ width: 90 }}
                          />
                          <TextField
                            size="small"
                            type="number"
                            label="Max"
                            value={opt.maxValue ?? ""}
                            onChange={(e) =>
                              updateOption(
                                qIdx,
                                optIdx,
                                "maxValue",
                                Number(e.target.value) || 100
                              )
                            }
                            sx={{ width: 90 }}
                          />
                        </>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeOption(qIdx, optIdx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addOption(qIdx, q.type as "RADIO" | "RANGE")}
                  >
                    Add option
                  </Button>
                </div>
              )}
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addQuestion}
            className="w-fit"
          >
            Add question
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
