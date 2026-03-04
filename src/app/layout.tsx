import '@/styles/globals.scss';
import ConfigWrapper from "@/common/configWrapper";
import { Metadata } from "next/types";
import { ASSETS } from '@/helpers/assets';

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";
const pageUrl = `${baseURL}/`;
const pageImage = `${baseURL}${ASSETS.logo}`;
const title = "Questionnaire App";
const description = "Create and share questionnaires, collect responses.";

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
		<html lang="en" suppressHydrationWarning>
			<body >
				<ConfigWrapper>
					{children}
				</ConfigWrapper>
			</body>
		</html>
	);
}