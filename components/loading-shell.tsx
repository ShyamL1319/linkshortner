type LoadingShellProps = {
  variant: "home" | "dashboard";
};

export function LoadingShell({ variant }: LoadingShellProps) {
  if (variant === "dashboard") {
    return (
      <div className="relative isolate overflow-hidden rounded-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.16),_transparent_24%),linear-gradient(to_bottom,_rgba(255,255,255,0.92),_rgba(245,247,255,0.92))]" />
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_22px_60px_-34px_rgba(59,130,246,0.4)] backdrop-blur-sm">
            <div className="space-y-4">
              <div className="h-3 w-24 rounded-full bg-primary/20" />
              <div className="h-10 w-3/4 rounded-2xl bg-[linear-gradient(90deg,rgba(99,102,241,0.18),rgba(236,72,153,0.25),rgba(99,102,241,0.18))] bg-[length:200%_100%] animate-[shimmer_1.8s_linear_infinite]" />
              <div className="h-4 w-1/2 rounded-full bg-muted" />
            </div>
          </div>

          <div className="grid gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-6 w-36 rounded-full bg-muted" />
                    <div className="h-10 w-24 rounded-full bg-primary/15" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded-full bg-muted" />
                    <div className="h-4 w-5/6 rounded-full bg-muted" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="h-10 w-32 rounded-full bg-primary/15" />
                    <div className="h-10 w-28 rounded-full bg-secondary/15" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.16),_transparent_22%),linear-gradient(to_bottom,_rgba(255,255,255,0.88),_rgba(248,250,255,0.96))]" />
      <div className="mx-auto flex min-h-[55vh] max-w-6xl flex-col items-center justify-center gap-8">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-primary/40 animate-[float_3.5s_ease-in-out_infinite]" />
          <span className="h-4 w-4 rounded-full bg-secondary/40 animate-[float_4.5s_ease-in-out_infinite]" />
          <span className="h-4 w-4 rounded-full bg-accent/50 animate-[float_5.5s_ease-in-out_infinite]" />
        </div>

        <div className="w-full max-w-4xl space-y-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="mx-auto h-4 w-28 rounded-full bg-muted" />
            <div className="h-12 rounded-2xl bg-[linear-gradient(90deg,rgba(99,102,241,0.18),rgba(236,72,153,0.22),rgba(99,102,241,0.18))] bg-[length:200%_100%] animate-[shimmer_1.8s_linear_infinite]" />
            <div className="mx-auto h-6 w-5/6 rounded-full bg-muted" />
          </div>

          <div className="flex justify-center">
            <div className="h-12 w-48 rounded-full bg-primary/15" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-2xl bg-primary/15" />
                  <div className="h-5 w-2/3 rounded-full bg-muted" />
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded-full bg-muted" />
                    <div className="h-4 w-5/6 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
