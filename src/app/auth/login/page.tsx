"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import type { LoginFormData, LoginResponse } from "@/interfaces";
import { loginSchema } from "@/interfaces";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/helpers/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (response: LoginResponse) => {
      localStorage.setItem("accessToken", response.data.token);

      toast.success("Login Successful!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    },
  });
  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Container maxWidth="sm" sx={{ gap: 4 }}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            padding: 2,
            boxShadow: 2,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Stack gap={2}>
              <Typography variant="h4" align="center">
                Admin Login
              </Typography>
              <Typography variant="h6" align="center">
                Welcome! Please enter your details to login.
              </Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap={1}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isPending}
                  sx={{ mt: 2 }}
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
