import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DesktopWarning from "@/components/DesktopWarning";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lets Pull Down",
  description: "Your gym manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Script
          id="otpless-sdk"
          src="https://otpless.com/v4/headless.js"
          data-appid={process.env.NEXT_PUBLIC_APP_ID}
          strategy="beforeInteractive" // load it early
        />
        <div className="hidden sm:flex w-full h-screen items-center justify-center">
          <DesktopWarning/>
        </div>
        <div className="w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
