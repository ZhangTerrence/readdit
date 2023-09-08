import "../styles/globals.css";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Readdit",
  description: "A Reddit clone built using NextJS and Typescript.",
  icons: "/readdit.png",
};

export default function RootLayout(props: {
  auth: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        {props.auth}
        {props.children}
      </body>
    </html>
  );
}
