"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Fade,
} from "@mui/material";
import {
  getPublicQuestionnaire,
  checkEmailResponse,
  submitQuestionnaireResponse,
} from "@/helpers/api";
import { Questionnaire, QuestionType, Question } from "@/interfaces";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function QuestionnairePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Flow State
  const [step, setStep] = useState(0); // 0: Email, 1..N: Questions, N+1: Success
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Data State
  const [email, setEmail] = useState("");
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Handlers
  const handleStart = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    try {
      const checkRes = await checkEmailResponse(slug, email);

      if (checkRes.data.alreadySubmitted) {
        toast.error("You have already responded to this questionnaire");
        return;
      }

      const questRes = await getPublicQuestionnaire(slug);
      setQuestionnaire(questRes.data);
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!questionnaire) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!questionnaire) return;
    setLoading(true);
    try {
      const payload = {
        email,
        answers: Object.entries(answers).map(([id, val]) => ({
          questionId: parseInt(id),
          value: val,
        })),
      };
      await submitQuestionnaireResponse(slug, payload);
      setSubmitted(true);
      setStep(questionnaire.questions.length + 1);
    } catch (err) {
      toast.error("Failed to submit response");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Rendering Helper
  const renderQuestionInput = (question: Question) => {
    const value = answers[question.id as unknown as number] || "";

    switch (question.type) {
      case QuestionType.FREE_TEXT:
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Type your answer here..."
            value={value}
            onChange={(e) =>
              updateAnswer(question.id as unknown as number, e.target.value)
            }
          />
        );
      case QuestionType.RADIO:
        return (
          <RadioGroup
            value={value}
            onChange={(e) =>
              updateAnswer(question.id as unknown as number, e.target.value)
            }
          >
            {question.options.map((opt, idx) => (
              <FormControlLabel
                key={idx}
                value={opt.label}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
        );
      case QuestionType.RANGE:
        return (
          <RadioGroup
            value={value}
            onChange={(e) =>
              updateAnswer(question.id as unknown as number, e.target.value)
            }
          >
            {question.options.map((opt, idx) => (
              <FormControlLabel
                key={idx}
                value={opt.label}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* EMAIL STEP */}
            {step === 0 && (
              <Stack spacing={4} sx={{ my: "auto" }}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    gutterBottom
                    color="primary"
                  >
                    Welcome!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Please provide your email to continue.
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStart}
                  disabled={loading}
                  sx={{ borderRadius: "50px", py: 1.5, fontWeight: "bold" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Start Questionnaire"
                  )}
                </Button>
              </Stack>
            )}

            {/* QUESTION STEPS */}
            {step > 0 &&
              questionnaire &&
              step <= questionnaire.questions.length && (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      color="primary"
                      sx={{ mb: 1, display: "block" }}
                    >
                      QUESTION {step} OF {questionnaire.questions.length}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(step / questionnaire.questions.length) * 100}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 4 }}>
                      {questionnaire.questions[step - 1].text}
                    </Typography>
                    {renderQuestionInput(questionnaire.questions[step - 1])}
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleBack}
                      disabled={step === 1}
                      sx={{ borderRadius: "50px" }}
                    >
                      Back
                    </Button>
                    {step === questionnaire.questions.length ? (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ borderRadius: "50px" }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleNext}
                        sx={{ borderRadius: "50px" }}
                      >
                        Next
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}

            {/* SUCCESS STEP */}
            {submitted && (
              <Stack
                spacing={3}
                alignItems="center"
                justifyContent="center"
                sx={{ my: "auto", textAlign: "center" }}
              >
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }} />
                <Typography variant="h4" fontWeight="800">
                  Thank You!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your response has been submitted successfully.
                </Typography>
              </Stack>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
