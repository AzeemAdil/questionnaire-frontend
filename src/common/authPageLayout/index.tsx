"use client";

import { ASSETS } from "@/helpers/assets";
import { Container } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../authProvider";

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (admin) {
      router.push("/");
    }
  }, [admin, router]);

  return (
    <div className="h-[100svh] w-full flex">
      <div className="flex-1 hidden lg:flex bg-background-paper">
        <Container className="h-full">
          <div className="h-full w-full flex flex-col items-start justify-between">
            <div className="pt-10">
              <Image
                src={ASSETS.logo}
                alt="logo"
                width={120}
                height={120}
                onClick={() => router.push("/")}
                className="cursor-pointer"
              />
            </div>
            <div className="pb-10 w-full flex flex-col justify-center">
              <p className="text-text-secondary text-lg">
                Manage your questionnaires and collect responses.
              </p>
            </div>
          </div>
        </Container>
      </div>
      <div className="flex-[1.4] flex flex-col">{children}</div>
    </div>
  );
}
