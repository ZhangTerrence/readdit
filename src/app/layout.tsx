import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Readdit",
  description: "A Reddit clone built using NextJS and Typescript.",
  icons: "/readdit.png",
};

export default function RootLayout(props: {
  children: React.ReactNode;
  authModals: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <AuthProvider>
          {props.authModals}
          {props.children}
        </AuthProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={true}
          theme="light"
        />
      </body>
    </html>
  );
}
