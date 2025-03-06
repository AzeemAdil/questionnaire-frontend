"use client"
import { ASSETS } from '@/helpers/assets';
import { Container } from '@mui/material';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { UserContext } from '../userProvider';

interface AuthPageLayoutProps {
    children: React.ReactNode;
}


const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
    const { user } = useContext(UserContext);

    const router = useRouter();


    useEffect(() => {
        if (user) {
            router.push("/app/create-new-reel");
        }
    }, [user, router]);

    return (
        <div
            className='h-[100svh] w-full flex'
        >
            <div
                className='flex-1 hidden lg:flex'
                style={{
                    // backgroundImage: `url(${ASSETS.americaFav})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <Container
                    className='h-full'
                >
                    <div className='h-full w-full flex flex-col items-start justify-between'>
                        <div className='pt-10'>
                            <Image
                                src={ASSETS.americaFav}
                                alt='logo'
                                width={120}
                                height={120}
                                onClick={() => router.push("/")}
                                className='cursor-pointer'
                            />
                        </div>
                        <div className='pb-10 w-full flex flex-col  justify-center'>
                           side
                        </div>
                    </div>
                </Container>
            </div>
            <div
                className='flex-[1.4]'
            >
                {children}
            </div>
        </div>
    )
}

export default AuthPageLayout