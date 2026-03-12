"use client";

import React from 'react'
import { Container, Stack, Typography, Box, IconButton, MenuItem, TextField, Divider , Button, Paper,} from "@mui/material";
import { useForm , useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionnaireSchema, QuestionnaireFormData, QuestionType } from "@/interfaces";
import { createQuestionnaire } from "@/helpers/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";

const OptionsFieldArray = ({
  questionIndex,
  control,
  register,
}: {
  questionIndex: number;
  control: Control<QuestionnaireFormData>;
  register: UseFormRegister<QuestionnaireFormData>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [fields, append]);

  return (
    <Box sx={{ ml: 4, mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        Options
      </Typography>
      <Stack spacing={1}>
        {fields.map((field, index) => (
          <Stack key={field.id} direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              size="small"
              placeholder={`Option ${index + 1}`}
              {...register(`questions.${questionIndex}.options.${index}.value`)}
            />
            <IconButton
              size="small"
              color="error"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button
          startIcon={<AddIcon />}
          size="small"
          onClick={() => append({ value: "" })}
          sx={{ alignSelf: "flex-start" }}
        >
          Add Option
        </Button>
      </Stack>
    </Box>
  );
};

const MakeQuestionnaire = () => {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          type: QuestionType.FREE_TEXT,
          text: "",
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchQuestions = watch("questions");

  const { mutate, isPending } = useMutation({
    mutationFn: createQuestionnaire,
    onSuccess: () => {
      toast.success("Questionnaire created successfully!");
      router.push("/all-questionnaires");
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      if (error) {
        console.error("Error Response Data:", error);
      }
      toast.error(error.message || "Something went wrong");
    },
  });

  const onSubmit = (data: QuestionnaireFormData) => {
    console.log("Form Data:", data);
    const transformedData = {
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => o.value),
      })),
    };
    console.log("Submitting Transformed Data:", transformedData);
    // @ts-expect-error - transformedData has string[] instead of object array
    mutate(transformedData);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Create New Questionnaire
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
        <Stack spacing={4}>
          <TextField
            fullWidth
            label="Questionnaire Title"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {Object.keys(errors).length > 0 && (
            <Paper sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Please fix the following errors:
              </Typography>
              <ul>
                {errors.title && <li>Title: {errors.title.message}</li>}
                {errors.questions?.message && <li>Questions: {errors.questions.message}</li>}
                {errors.questions && Array.isArray(errors.questions) && errors.questions.map((qErr, i) => (
                  qErr && (
                    <li key={i}>
                      Question #{i + 1}: 
                      {qErr.text?.message && ` Text: ${qErr.text.message}`}
                      {qErr.options?.message && ` Options: ${qErr.options.message}`}
                    </li>
                  )
                ))}
              </ul>
            </Paper>
          )}

          <Divider />

          {fields.map((field, index) => {
            const currentType = watchQuestions[index]?.type;

            return (
              <Paper
                key={field.id}
                sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      select
                      label="Type"
                      sx={{ minWidth: 150 }}
                      {...register(`questions.${index}.type` as const)}
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
                      {...register(`questions.${index}.text` as const)}
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

                  {/* Render options if type is Radio or Range */}
                  {(currentType === QuestionType.RADIO ||
                    currentType === QuestionType.RANGE) && (
                    <OptionsFieldArray
                      questionIndex={index}
                      control={control}
                      register={register}
                    />
                  )}
                </Stack>
              </Paper>
            );
          })}

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() =>
              append({ type: QuestionType.FREE_TEXT, text: "", options: [] })
            }
            sx={{ alignSelf: "flex-start" }}
          >
            Add Question
          </Button>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            sx={{ py: 1.5 }}
          >
            {isPending ? "Creating..." : "Save Questionnaire"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default MakeQuestionnaire;
