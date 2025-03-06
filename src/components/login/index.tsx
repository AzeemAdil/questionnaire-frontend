"use client";
import PasswordField from "@/common/passwordField";
import { ASSETS } from "@/helpers/assets";
import { register as registerUser } from "@/helpers/api";
import { Button, Divider, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { SignupFormData, signupSchema } from "@/interfaces";
import { Google, LinkedIn } from "@mui/icons-material";

const LoginPage = () => {
  const router = useRouter();

  // Initialize React Hook Form with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Setup React Query mutation
  const mutation = useMutation({
    mutationFn: (data: SignupFormData) => {
      // Generate username as firstName_lastName_timestamp
      const timestamp = Date.now();
      const userName =
        `${data.firstName}_${data.lastName}_${timestamp}`.toLowerCase();
      return registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        userName: userName,
      });
    },
    onSuccess: (response) => {
      // Store tokens in localStorage or handle with your auth management
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.removeItem("VideoGeneratedId");

      toast.success("Account created successfully!");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full h-[100svh] overflow-hidden overflow-y-scroll flex flex-col items-center justify-center pt-24 pb-10">
      <div className="flex flex-col max-w-[500px] min-w-[300px] gap-2 justify-center overflow-hidden" >
        <Image
          src={ASSETS.americaImage}
          alt="logo"
          width={120}
          height={120}
          className="flex lg:hidden mb-5"
        />
        <p className="text-text-primary text-4xl">Create Account</p>
        <p className="text-text-primary text-lg">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary">
            Login
          </Link>
        </p>
        <br />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                placeholder="Enter your first name"
                className="w-full"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                placeholder="Enter your last name"
                className="w-full"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                placeholder="Enter your email address"
                className="w-full"
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
                className="w-full"
                showStrengthBar
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <br />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full h-14"
            disabled={mutation.isPending}
          >
            <p className="text-white text-lg">
              {mutation.isPending ? "Registering..." : "Register"}
            </p>
          </Button>
        </form>

        <br />
        <Divider>
					<p className="text-text-secondary text-lg">or</p>
				</Divider>
				<br />

				<Button
					startIcon={<Google className="text-primary" />}
					variant="outlined"
					className="w-full h-14 border-text-secondary text-text-secondary"
				>
					<p className="text-text-primary text-lg">Continue with Google</p>
				</Button>

				<Button
					startIcon={<LinkedIn className="text-primary" />}
					variant="outlined"
					className="w-full h-14 border-text-secondary text-text-secondary"
				>
					<p className="text-text-primary text-lg">Continue with Linkedin</p>
				</Button>
      </div>
    </div>
  );
};

export default LoginPage;
