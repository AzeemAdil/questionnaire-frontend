"use client";

import PasswordField from "@/common/passwordField";
import AuthPageLayout from "@/common/authPageLayout";
import { AuthContext } from "@/common/authProvider";
import { login } from "@/helpers/api";
import { loginSchema, LoginFormData } from "@/interfaces";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ASSETS } from "@/helpers/assets";

export default function LoginPage() {
  const { login: setAuth } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data.email, data.password),
    onSuccess: (response) => {
      const { token, admin } = response.data;
      setAuth(token, admin);
      toast.success("Login successful!");
      // AuthPageLayout will redirect to / when admin is set
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  return (
    <AuthPageLayout>
      <div className="w-full h-[100svh] overflow-y-auto flex flex-col items-center justify-center pt-24 pb-10">
        <div className="flex flex-col max-w-[500px] min-w-[300px] gap-4">
          <Image
            src={ASSETS.logo}
            alt="Logo"
            width={120}
            height={120}
            className="flex lg:hidden mb-5 mx-auto"
          />
          <p className="text-text-primary text-4xl font-medium">Admin Login</p>
          <p className="text-text-secondary text-lg">
            Sign in to manage your questionnaires
          </p>

          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="flex flex-col gap-4 w-full"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="admin@example.com"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordField
                  {...field}
                  label="Password"
                  placeholder="Enter your password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full h-14"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </AuthPageLayout>
  );
}
