"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useForm, useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  QuestionType,
  QuestionnaireFormData,
  questionnaireSchema,
} from "@/interfaces";

interface CreateQuestionnaireDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateQuestionnaireDialog = ({
  open,
  onClose,
}: CreateQuestionnaireDialogProps) => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      title: "",
      questions: [{ type: QuestionType.FREE_TEXT, text: "", options: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data: QuestionnaireFormData) => {
    const transformedData = {
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => o.value),
      })),
    };
    console.log("Creating Questionnaire:", transformedData);
    // Here we would call the API to create the questionnaire
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight="bold">Create Questionnaire</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack gap={3}>
            <TextField
              fullWidth
              label="Questionnaire Title"
              placeholder="e.g. Monthly Feedback"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Divider />

            <Typography variant="h6" fontWeight="bold">
              Questions
            </Typography>

            {fields.map((field, index) => {
              const questionType = watch(`questions.${index}.type`);

              return (
                <Box
                  key={field.id}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <Stack gap={2}>
                    <Stack direction="row" gap={2} alignItems="flex-start">
                      <TextField
                        select
                        label="Type"
                        sx={{ minWidth: 150 }}
                        {...register(`questions.${index}.type`)}
                      >
                        <MenuItem value={QuestionType.FREE_TEXT}>
                          Free Text
                        </MenuItem>
                        <MenuItem value={QuestionType.RADIO}>Radio</MenuItem>
                        <MenuItem value={QuestionType.RANGE}>Range</MenuItem>
                      </TextField>

                      <TextField
                        fullWidth
                        label={`Question #${index + 1}`}
                        {...register(`questions.${index}.text`)}
                        error={!!errors.questions?.[index]?.text}
                        helperText={errors.questions?.[index]?.text?.message}
                      />

                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    {(questionType === QuestionType.RADIO ||
                      questionType === QuestionType.RANGE) && (
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, fontWeight: "bold" }}
                        >
                          Options
                        </Typography>
                        <OptionsFieldArray
                          index={index}
                          control={control}
                          register={register}
                          errors={errors}
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>
              );
            })}

            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() =>
                append({
                  type: QuestionType.FREE_TEXT,
                  text: "",
                  options: [],
                })
              }
              sx={{ alignSelf: "flex-start" }}
            >
              Add Question
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create Questionnaire
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// Sub-component for options for Radio and Range types
const OptionsFieldArray = ({
  index,
  control,
  register,
}: {
  index: number;
  control: Control<QuestionnaireFormData>;
  register: UseFormRegister<QuestionnaireFormData>;
  errors: FieldErrors<QuestionnaireFormData>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  // Ensure at least one option if it's not free text
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [fields, append]);

  return (
    <Stack gap={1}>
      {fields.map((optionField, optionIndex) => (
        <Stack key={optionField.id} direction="row" gap={1} alignItems="center">
          <TextField
            size="small"
            fullWidth
            placeholder={`Option ${optionIndex + 1}`}
            {...register(`questions.${index}.options.${optionIndex}.value`)}
          />
          <IconButton
            size="small"
            color="error"
            onClick={() => remove(optionIndex)}
            disabled={fields.length === 1}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => append({ value: "" })}
        sx={{ alignSelf: "flex-start", mt: 1 }}
      >
        Add Option
      </Button>
    </Stack>
  );
};

export default CreateQuestionnaireDialog;
