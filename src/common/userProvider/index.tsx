"use client"
import { getUser } from "@/helpers/api";
import { UserData } from "@/interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, FC, PropsWithChildren, useCallback } from "react";
import { CircularProgress } from "@mui/material";

const toSkip: string[] = []

type UserContext = {
    user: UserData | null | undefined;
    isError: boolean;
    isLoading: boolean;
    refetch: () => void;
    logout: () => void;
};

export const UserContext = createContext<UserContext>({
    user: null,
    isError: false,
    isLoading: false,
    logout: () => { },
    refetch: () => { },
});

const DashboardSkeleton = () => {
    return <CircularProgress />

};

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const token = localStorage.getItem("accessToken");

    const { data, isLoading, isError, refetch, } = useQuery(
        {
            queryKey: ["user"],
            queryFn: getUser,
            staleTime: Infinity,
            enabled: !!token,
            refetchOnWindowFocus: false,
        }
    );

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.setQueryData(["user"], null);
        refetch();
        navigate.push("/");
    }, [navigate, refetch, queryClient]);

    return (
        <UserContext.Provider
            value={{
                user: data?.data,
                isError,
                isLoading,
                refetch: () => {
                    refetch()
                },
                logout,
            }}
        >
            {
                isLoading && !toSkip.includes(pathname) ? (
                    <DashboardSkeleton />
                ) : children
            }
        </UserContext.Provider>
    );
}

export default UserProvider;