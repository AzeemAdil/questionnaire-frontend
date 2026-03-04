"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/common/authProvider";
import DashboardLayout from "@/common/dashboardLayout";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="w-full h-[100svh] flex items-center justify-center">
        <p className="text-text-secondary">Redirecting to login...</p>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
