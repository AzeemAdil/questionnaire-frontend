"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuestionnaireBySlug, checkEmail, submitResponse } from "@/helpers/api";
import { Question, Questionnaire } from "@/interfaces";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-hot-toast";

type Step = "email" | "checking" | "already_submitted" | "quiz" | "submitted";

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: questionnaireData, isLoading } = useQuery({
    queryKey: ["questionnaire", slug],
    queryFn: () => getQuestionnaireBySlug(slug),
    enabled: step === "quiz" || step === "submitted",
  });

  const checkEmailMutation = useMutation({
    mutationFn: () => checkEmail(slug, email),
    onSuccess: (res) => {
      const d = res.data as { exists?: boolean; alreadySubmitted?: boolean };
      const exists = d?.exists ?? d?.alreadySubmitted ?? false;
      if (exists) {
        setStep("already_submitted");
      } else {
        setStep("quiz");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to check email");
      setStep("email");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      submitResponse(slug, {
        email,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId: Number(questionId),
          value,
        })),
      }),
    onSuccess: () => {
      setStep("submitted");
      toast.success("Response submitted!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit");
    },
  });

  const questionnaire: Questionnaire | undefined = questionnaireData?.data;
  const questions: Question[] = questionnaire?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setStep("checking");
    checkEmailMutation.mutate();
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    if (!answers[currentQuestion.id]?.trim()) {
      toast.error("Please answer the question");
      return;
    }
    if (isLastQuestion) {
      submitMutation.mutate();
    } else {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((i) => Math.max(0, i - 1));
  };

  // ─── Email step ───────────────────────────────────────────────
  if (step === "email") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <Typography variant="h5" gutterBottom>
              Enter your email
            </Typography>
            <Typography color="textSecondary" className="mb-4">
              We&apos;ll use this to track your response. Each email can only submit once per questionnaire.
            </Typography>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                fullWidth
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Checking email ───────────────────────────────────────────
  if (step === "checking") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // ─── Already submitted ────────────────────────────────────────
  if (step === "already_submitted") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Typography variant="h6" color="textSecondary">
              You have already submitted a response for this questionnaire using this email.
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              Each email can only submit once.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Quiz (slides) ────────────────────────────────────────────
  if (step === "quiz" && isLoading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (step === "quiz" && questionnaire && currentQuestion) {
    const q = currentQuestion;
    const value = answers[q.id] ?? "";

    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center p-4 bg-background">
        <Card className="max-w-lg w-full">
          <CardContent className="p-6">
            <Typography variant="caption" color="textSecondary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="h6" className="mt-2 mb-4">
              {q.text}
            </Typography>

            {q.type === "FREE_TEXT" && (
              <TextField
                multiline
                rows={4}
                value={value}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder="Your answer"
                fullWidth
                className="mt-2"
              />
            )}

            {q.type === "RADIO" && (
              <FormControl component="fieldset" className="w-full mt-2">
                <RadioGroup
                  value={value}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                >
                  {q.options?.map((opt, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={opt.label}
                      control={<Radio />}
                      label={opt.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {q.type === "RANGE" && (
              <div className="mt-4">
                <RadioGroup
                  value={value}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                >
                  {q.options?.map((opt, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={opt.label}
                      control={<Radio />}
                      label={`${opt.label}${opt.minValue != null && opt.maxValue != null ? ` (${opt.minValue} - ${opt.maxValue})` : ""}`}
                    />
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outlined"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending
                  ? "Submitting..."
                  : isLastQuestion
                    ? "Submit"
                    : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Submitted success ────────────────────────────────────────
  if (step === "submitted") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Typography variant="h5" color="success.main">
              Thank you!
            </Typography>
            <Typography color="textSecondary" className="mt-2">
              Your response has been submitted successfully.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] flex items-center justify-center">
      <Typography color="textSecondary">Loading...</Typography>
    </div>
  );
}
