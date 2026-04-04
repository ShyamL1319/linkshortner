import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import { Bot } from "lucide-react";
import { ChatWidget } from "@/components/chat-widget";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen" suppressHydrationWarning>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              button:
                "rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground",
              buttonPrimary:
                "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90",
            },
          }}
        >
          <div className="flex min-h-screen flex-col text-foreground">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            {/* <OpenApiChatWidget /> */}
            <ChatWidget
              apiEndpoint="/api/chat"
              title="Gemini Assistant"
              description="Powered by Google Gemini."
              icon={<Bot className="h-4 w-4" />}
            />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
