import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import ToasterProvider from "@/providers/toaster-provider";
import AuthProvider from "@/providers/auth-provider";
import ActiveStatus from "@/components/active-status";

const font = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
export const metadata: Metadata = {
  title: "EchoSphere - Messeging App",
  description: "Send or recieve messeges flawlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <AuthProvider>
          <ToasterProvider />
          <ActiveStatus />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
