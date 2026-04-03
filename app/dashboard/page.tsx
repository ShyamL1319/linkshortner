import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/data/links";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkDialog } from "./create-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";
import { ShortLinkActions } from "@/components/short-link-actions";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const links = await getUserLinks(userId);
  const totalLinks = links.length;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(24,24,27,0.08),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(24,24,27,0.06),_transparent_28%),linear-gradient(to_bottom,_rgba(248,250,252,0.96),_rgba(255,255,255,1))]" />
      <div className="container mx-auto max-w-6xl space-y-8 py-10 sm:py-12">
        <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-zinc-950 px-6 py-8 text-white shadow-2xl sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_22%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                Dashboard
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Manage every short link from one polished workspace.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                Create, update, copy, and share short links without leaving the
                page. Your public URL is always one click away.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:items-end">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Total links
                </p>
                <p className="mt-2 text-3xl font-semibold">{totalLinks}</p>
              </div>
              <CreateLinkDialog />
            </div>
          </div>
        </section>

        {links.length === 0 ? (
          <Card className="overflow-hidden rounded-3xl border-dashed bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="py-16">
              <div className="mx-auto max-w-md text-center">
                <p className="text-lg font-semibold">No links yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first short link and we’ll surface the share URL
                  right here for quick copying.
                </p>
                <div className="mt-6 flex justify-center">
                  <CreateLinkDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5">
            {links.map((link) => (
              <Card
                key={link.id}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {link.shortCode}
                      </div>
                      <CardTitle className="text-xl break-all sm:text-2xl">
                        {link.shortCode}
                      </CardTitle>
                      <CardDescription className="break-all text-sm sm:text-base">
                        {link.originalUrl}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditLinkDialog
                        link={{
                          id: link.id,
                          originalUrl: link.originalUrl,
                          shortCode: link.shortCode,
                        }}
                      />
                      <DeleteLinkDialog
                        linkId={link.id}
                        shortCode={link.shortCode}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-4">
                    <ShortLinkActions shortCode={link.shortCode} />
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        Created: {link.createdAt.toLocaleDateString()}
                      </span>
                      <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
                      <span>
                        Updated: {link.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
