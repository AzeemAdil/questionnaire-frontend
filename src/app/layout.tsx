import '@/styles/globals.scss';
import ConfigWrapper from "@/common/configWrapper";
import { Metadata } from "next/types";
import { ASSETS } from '@/helpers/assets';

const baseURL = "https://test.com";
const pageUrl = `${baseURL}/`;
const pageImage = `${baseURL}${ASSETS.americaImage}`;
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
		<html lang="en" suppressHydrationWarning>
			<body >
				<ConfigWrapper>
					{children}
				</ConfigWrapper>
			</body>
		</html>
	);
}