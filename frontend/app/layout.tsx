import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "#키워드",
    description: "키워드로 찾아보는 AI 프롬프트 갤러리",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="ko" className="h-full antialiased">
            <body className="flex min-h-full flex-col">
                {children}
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
