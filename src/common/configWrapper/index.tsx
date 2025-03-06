"use client";

import { ThemeProvider } from 'next-themes';
import MUIThemeProvider from '@/theme/ThemeProvider';
import { ASSETS } from '@/helpers/assets';
import { ReactQueryProvider } from '../queryProvider';
import { Toaster } from 'react-hot-toast';
import UserProvider from '../userProvider';

export default function ConfigWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <link rel="icon" type="image/x-icon" href={ASSETS.favIcon} />
            <ReactQueryProvider>
                <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
                    <MUIThemeProvider>
                        <UserProvider>
                            <div className="bg-background">
                                {children}
                            </div>
                            <Toaster />
                        </UserProvider>
                    </MUIThemeProvider>
                </ThemeProvider>
            </ReactQueryProvider>
        </>
    );
}