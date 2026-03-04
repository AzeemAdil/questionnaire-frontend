"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { ASSETS } from "@/helpers/assets";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import { useContext, useState } from "react";
import { AuthContext } from "../authProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div className="w-full h-[100svh] flex flex-col lg:flex-row overflow-hidden">
      <div className="h-full hidden lg:flex flex-col justify-between w-[240px] p-5 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-3">
          <Image
            src={ASSETS.logo}
            alt="logo"
            width={80}
            height={80}
            className="cursor-pointer"
          />
          <p className="text-text-secondary text-sm">Questionnaire Admin</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full h-full flex flex-col flex-1 overflow-hidden">
        <header className="h-16 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 shrink-0">
          <Image
            src={ASSETS.logo}
            alt="logo"
            width={40}
            height={40}
            className="lg:hidden"
          />
          <div className="flex-1 lg:hidden" />
          <Button
            variant="text"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center gap-2 !text-text-primary"
          >
            {admin?.name}
            <Avatar sx={{ width: 36, height: 36 }} alt={admin?.name}>
              {admin?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </header>

        <main className="flex-1 overflow-y-auto bg-background" id="scrollDocument">
          {children}
        </main>
      </div>
    </div>
  );
}
