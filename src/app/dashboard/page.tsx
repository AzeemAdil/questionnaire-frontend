"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import CreateQuestionnaireDialog from "@/components/dashboard/CreateQuestionnaireDialog";

// Mock data for initial UI
const mockQuestionnaires = [
  { id: "1", title: "User Feedback 2024", questionCount: 5 },
  { id: "2", title: "Product Survey", questionCount: 10 },
];

const DashboardPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/questionnaire/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack gap={4}>
        {/* Top Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Questionnaires
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
            sx={{ px: 3, py: 1 }}
          >
            Create New
          </Button>
        </Box>

        {/* Recent Questionnaires Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
            Recent Questionnaires
          </Typography>
          <Grid container spacing={3}>
            {mockQuestionnaires.map((q) => (
              <Grid item xs={12} sm={6} md={4} key={q.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 2,
                    borderRadius: 3,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {q.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {q.questionCount} Questions
                        </Typography>
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleCopyLink(q.id)}
                        size="small"
                        title="Copy Link"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      <CreateQuestionnaireDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Container>
  );
};

export default DashboardPage;
