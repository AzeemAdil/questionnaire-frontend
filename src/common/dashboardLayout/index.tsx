"use client"
import ThemeToggle from "@/components/ThemeToggle"
import { ASSETS } from "@/helpers/assets"
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material"
import { useTheme } from "next-themes"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import ReceiptIcon from '@mui/icons-material/Receipt';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import { Settings } from "@mui/icons-material"
import { useContext,  useState } from "react"
import { UserContext } from "../userProvider"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const { logout,user } = useContext(UserContext)

    const { resolvedTheme } = useTheme()
    const router = useRouter()
    const pathName = usePathname()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // useEffect(() => {
    //     if (!user) {
    //         router.push("/auth/login");
    //     }
    // }, [user, router]);

    return (
        <div
            className='w-full h-[100svh] flex flex-col lg:flex-row  overflow-hidden'
        >
            <div
                className='h-full hidden lg:flex flex-col justify-between w-[280px] p-5 '
            >
                <div className="flex flex-col gap-3">
                    <h1>Side bar</h1>
                </div>
                <div>
                    <ThemeToggle />
                </div>
            </div>
            <div className="w-full h-full p-4 flex flex-col">
                <div className="w-full h-[60px] flex justify-between items-center lg:justify-end">
                    <Image
                        src={resolvedTheme === "dark" ? ASSETS.americaFav : ASSETS.americaFav}
                        alt='logo'
                        width={120}
                        height={120}
                        className="mb-5 flex lg:hidden"
                    />
                    <div>
                        <Button
                            variant="text"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                            }}
                            className="flex items-center gap-2 !text-text-primary"
                        >
                            {user?.firstName} {user?.lastName}
                            <Avatar
                                src={ASSETS.americaFav}
                                alt='avatar'
                            />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    // Add logout logic here
                                    logout()
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="w-full flex-1 overflow-hidden overflow-y-scroll" id="scrollDocument">
                    {children}
                </div>
                <div className="w-full  lg:hidden h-[70px] grid grid-cols-5">
                    <div className="flex justify-center items-center">
                        <IconButton onClick={() => router.push("/app/manage-invoices")}>
                            <ReceiptIcon className={`!text-3xl ${pathName === "/app/manage-invoices" ? "text-primary" : "text-text-secondary"}`} />
                        </IconButton>
                    </div>
                    <div className="flex justify-center items-center">
                        <IconButton onClick={() => router.push("/app/my-reels")}>
                            <CameraOutdoorIcon className={`!text-3xl ${pathName === "/app/my-reels" ? "text-primary" : "text-text-secondary"}`} />
                        </IconButton>
                    </div>
                    <div className="flex justify-center items-center">
                        <IconButton onClick={() => router.push("/app/create-new-reel")}>
                            <Image
                                src={pathName === "/app/create-new-reel" ? ASSETS.americaFav : ASSETS.americaFav}
                                alt='favIcon'
                                width={40}
                                height={40}
                            />
                        </IconButton>
                    </div>
                    <div className="flex justify-center items-center">
                        <IconButton onClick={() => router.push("/app/settings")}>
                            <Settings className={`!text-3xl ${pathName === "/app/settings" ? "text-primary" : "text-text-secondary"}`} />
                        </IconButton>
                    </div>
                    <div className="flex justify-center items-center">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DashboardLayout