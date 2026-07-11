"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Card, Input } from "@/components/ui";

type Settings = {
  currentWeek?: number | null;
  currentMonth?: number | null;
  weeklyTargetHours: number;
  studyDaysPerWeek: number;
  githubProfileUrl?: string | null;
  mainRepositoryUrl?: string | null;
  ninetyDayLock: boolean;
};

export function SettingsClient({ settings }: { settings: Settings | null }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<Settings>({
    defaultValues: {
      currentWeek: settings?.currentWeek ?? undefined,
      currentMonth: settings?.currentMonth ?? undefined,
      weeklyTargetHours: settings?.weeklyTargetHours ?? 12,
      studyDaysPerWeek: settings?.studyDaysPerWeek ?? 5,
      githubProfileUrl: settings?.githubProfileUrl ?? "",
      mainRepositoryUrl: settings?.mainRepositoryUrl ?? "",
      ninetyDayLock: settings?.ninetyDayLock ?? true
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings and First Run</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Configure the operating system without entering dates. The 90-day lock exists to reduce roadmap switching.
        </p>
      </div>
      <Card className="p-5">
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit((data) => {
            startTransition(async () => {
              const response = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
              });
              if (!response.ok) {
                toast.error("Settings update failed");
                return;
              }
              toast.success("Settings saved");
            });
          })}
        >
          <label>
            <span className="mb-1.5 block text-sm font-medium">Current Week</span>
            <Input type="number" min={1} max={24} {...register("currentWeek")} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Current Month</span>
            <Input type="number" min={1} max={12} {...register("currentMonth")} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Weekly Target Hours</span>
            <Input type="number" min={0} {...register("weeklyTargetHours")} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Study Days Per Week</span>
            <Input type="number" min={0} max={7} {...register("studyDaysPerWeek")} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">GitHub Profile URL</span>
            <Input type="url" {...register("githubProfileUrl")} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium">Main Repository URL</span>
            <Input type="url" {...register("mainRepositoryUrl")} />
          </label>
          <label className="flex items-center gap-3 md:col-span-2">
            <input type="checkbox" className="h-5 w-5 accent-primary" {...register("ninetyDayLock")} />
            <span className="text-sm font-medium">Review and keep the 90-day roadmap lock</span>
          </label>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" loading={pending}>Save setup</Button>
            <Button type="button" variant="secondary" onClick={() => toast.info("Skipped optional setup")}>
              Skip optional settings
            </Button>
          </div>
        </form>
      </Card>
      <BackupRestore />
    </div>
  );
}

function BackupRestore() {
  const [pending, startTransition] = useTransition();
  return (
    <Card className="p-5">
      <h2 className="font-semibold">Backup and Restore</h2>
      <p className="mt-2 text-sm text-muted-foreground">Export the full application as JSON or import a previous backup.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <a href="/api/export/backup">Export full backup</a>
        </Button>
        <label className="inline-flex h-10 cursor-pointer items-center rounded-md border bg-muted px-4 text-sm font-medium">
          Import backup
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              startTransition(async () => {
                const text = await file.text();
                const response = await fetch("/api/import", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: text
                });
                const payload = (await response.json()) as { imported?: number; error?: string };
                if (!response.ok) toast.error("Import failed", { description: payload.error });
                else toast.success(`Imported ${payload.imported ?? 0} records`);
              });
            }}
          />
        </label>
        {pending && <span className="self-center text-sm text-muted-foreground">Restoring...</span>}
      </div>
    </Card>
  );
}
