import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpButton } from "@clerk/nextjs";
import { Link2, Lock, Zap } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.16),_transparent_22%),linear-gradient(to_bottom,_rgba(255,255,255,0.82),_rgba(248,250,255,0.96))]" />
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-36 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Fast, branded link management
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Shorten Your Links,
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Amplify Your Reach
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            Create short, memorable links in seconds. Manage all your URLs in
            one colorful dashboard.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20"
              >
                Get Started Free
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Powerful Features for Modern Links
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to manage and share your shortened links
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group border-border/70 bg-card/85 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Link2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl text-foreground">
                Easy Link Shortening
              </CardTitle>
              <CardDescription>
                Create short, branded URLs instantly with our simple interface.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-border/70 bg-card/85 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary/10">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary/15">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl text-foreground">
                Secure & Private
              </CardTitle>
              <CardDescription>
                Your links are protected with enterprise-grade security.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-border/70 bg-card/85 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground transition-colors group-hover:bg-accent/30">
                <Zap className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl text-foreground">
                Lightning Fast
              </CardTitle>
              <CardDescription>
                Instant redirects ensure the best experience for your users.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Sign Up",
              description:
                "Create your free account in seconds with secure authentication.",
              accent: "bg-primary/15 text-primary",
            },
            {
              step: "2",
              title: "Shorten",
              description:
                "Paste your long URL and get a short, memorable link instantly.",
              accent: "bg-secondary/15 text-secondary",
            },
            {
              step: "3",
              title: "Share",
              description:
                "Share your short link anywhere and reach your audience.",
              accent: "bg-accent/20 text-accent-foreground",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-4 text-center">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border/70 shadow-sm ${item.accent}`}
              >
                <span className="text-2xl font-bold">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 pb-20 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(236,72,153,0.12),rgba(34,211,238,0.12))] shadow-[0_24px_80px_-40px_rgba(59,130,246,0.4)]">
          <CardContent className="flex flex-col items-center space-y-6 px-4 py-16 text-center sm:px-8">
            <h2 className="max-w-2xl text-3xl font-bold text-foreground md:text-4xl">
              Ready to Transform Your Links?
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Join thousands of users who trust our platform for their link
              management needs.
            </p>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20"
              >
                Start Shortening Now
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
