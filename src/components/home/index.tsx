import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap:2
        }}
      >
        <Typography variant="h2">Welcome to Questionnaire App</Typography>
        <Typography variant="h5">
          Create and share questionnaires with anyone
        </Typography>
        <Stack>
          <Button
            size="large"
            variant="contained"
            component={Link}
            href="/auth/login"
          >
            <Typography
            variant="h6"
            >
            Admin Login
            </Typography>
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default HomePage;
