import { ASSETS } from '@/helpers/assets';
import '@/styles/globals.scss';
import { Metadata } from "next/types";


const baseURL = "https://test.com";
const pageUrl = `${baseURL}/`;
const pageImage = `${baseURL}${ASSETS.americaFav}`;
const title = `Title`;
const description = "description";

export const metadata: Metadata = {
    title: title,
    description: description,
    openGraph: {
        title: title,
        description: description,
        url: pageUrl,
        siteName: pageUrl,
        images: [
            {
                url: pageImage,
                secureUrl: pageImage,
                alt: "Logo",
            },
        ],
    },
    twitter: {
        title: title,
        description: description,
        card: "summary_large_image",
        images: [
            {
                url: pageImage,
                secureUrl: pageImage,
                alt: "Logo",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        children
    );
}