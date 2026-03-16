"use client";

import React from "react";
import { Container, Stack, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";

const Dashboard = () => {
  return (

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={6} alignItems="center">
          <Typography variant="h3" fontWeight="bold" textAlign="center">
            Questionnaire Admin Dashboard
          </Typography>

          <Stack direction="row" spacing={4}>
            <Button
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              // startIcon={<AddIcon />}
              component={Link}
              href="/make-questionnaire"
            >
              Create Questionnaire
            </Button>
            <Button
              variant="outlined"
              size="large"
              // startIcon={<ListIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              component={Link}
              href="/all-questionnaires"
            >
              View All Questionnaires
            </Button>
          </Stack>

          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 4,
              maxWidth: "lg",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="600">
              How to use the app:
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ color: "text.secondary", lineHeight: 2 }}
            >
              <ol>
                <li>
                  Click <strong>Create Questionnaire</strong> to start building
                  a new set of questions.
                </li>
                <li>
                  Choose between <strong>Free Text, Radio, or Range</strong> for
                  each question type.
                </li>
                <li>
                  Once saved, you can find your questionnaire in the{" "}
                  <strong>View All</strong> section.
                </li>
                <li>
                  Copy the unique link and share it with your users to start
                  collecting responses.
                </li>
              </ol>
            </Typography>
          </Paper>
        </Stack>
      </Container>
  );
};

export default Dashboard;
