"use client";

import React from "react";
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAdminQuestionnaires } from "@/helpers/api";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import moment from "moment";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AllQuestionnaires = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminQuestionnaires"],
    queryFn: getAdminQuestionnaires,
  });

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/questionnaire/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography color="error" textAlign="center">
          Failed to load questionnaires. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton component={Link} href="/dashboard">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h3" fontWeight="bold">
                All Questionnaires
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Total: {data?.count || 0}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {data?.data.map((q) => (
              <Grid item xs={12} sm={6} md={4} key={q.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {q.title}
                        </Typography>
                        <Tooltip title="Copy Public Link">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyLink(q.slug)}
                            color="primary"
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "3em",
                        }}
                      >
                        {q.description || "No description provided."}
                      </Typography>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mt: 2 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {q.questionCount} Questions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created at:{" "}
                          {moment(q.createdAt).format("MMM DD, YYYY")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {(!data?.data || data.data.length === 0) && (
              <Grid item xs={12}>
                <Paper sx={{ p: 8, textAlign: "center", borderRadius: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No questionnaires found.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component={Link}
                    href="/make-questionnaire"
                  >
                    Create Your First One
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Stack>
      </Container>
  );
};

export default AllQuestionnaires;
