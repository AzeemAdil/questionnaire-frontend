"use client";

import { useQuery } from "@tanstack/react-query";
import { listQuestionnaires } from "@/helpers/api";
import { Questionnaire } from "@/interfaces";
import { Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import CreateQuestionnaireDialog from "@/components/createQuestionnaireDialog";

export default function AdminDashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["questionnaires"],
    queryFn: async () => {
      const res = await listQuestionnaires();
      return res.data;
    },
  });

  const questionnaires: Questionnaire[] = data || [];

  const copyLink = useCallback((slug: string) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/quiz/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">
          My Questionnaires
        </h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Create Questionnaire
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error">
          Failed to load questionnaires. Please try again.
        </Typography>
      ) : questionnaires.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No questionnaires yet
            </Typography>
            <Typography color="textSecondary" className="mb-4">
              Create your first questionnaire to start collecting responses.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDialogOpen(true)}
            >
              Create Questionnaire
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questionnaires.map((q) => (
            <Card key={q.id} className="overflow-hidden">
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Typography variant="h6" className="truncate">
                      {q.title}
                    </Typography>
                    {q.description && (
                      <Typography variant="body2" color="textSecondary" className="line-clamp-2 mt-1">
                        {q.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary" className="mt-1 block">
                      {q.questions?.length || 0} question(s) · Slug: {q.slug}
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyLink(q.slug)}
                    className="shrink-0"
                  >
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateQuestionnaireDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
