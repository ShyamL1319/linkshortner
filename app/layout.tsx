import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthControls } from "@/components/auth-controls";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Shortener - Create & Manage Short URLs",
  description: "Create and manage short links with advanced analytics and tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light h-full antialiased"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              button:
                "px-4 py-2 text-sm font-medium text-black hover:opacity-80 transition-opacity",
              buttonPrimary:
                "px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:opacity-80 transition-opacity",
            },
          }}
        >
          <header className="flex items-center justify-between w-full px-6 py-4 border-b bg-white">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">
                Link Shortener
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <AuthControls />
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
