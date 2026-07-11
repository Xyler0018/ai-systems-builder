import { AppShell } from "@/components/app-shell";
import { SettingsClient } from "@/components/settings-client";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const [settings, rules] = await Promise.all([
    prisma.userSettings.findFirst(),
    prisma.rule.findMany({ orderBy: { order: "asc" } })
  ]);

  return (
    <AppShell currentWeek={settings?.currentWeek}>
      <SettingsClient settings={settings} />
      <Card className="mt-6 p-5">
        <h2 className="font-semibold">Non-negotiable Rules</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-md border p-3 text-sm">
              <div className="font-medium">{rule.order}. {rule.text}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Compliance: {rule.isFollowed ? "Following" : "Not marked yet"}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
export const dynamic = "force-dynamic";
