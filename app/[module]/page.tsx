import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TrackerPage } from "@/components/tracker-page";
import { getModuleRows, getRelations } from "@/lib/data";
import { getModule } from "@/lib/module-config";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ module: string }>;
};

export default async function ModulePage({ params }: Props) {
  const { module: key } = await params;
  const moduleConfig = getModule(key);
  if (!moduleConfig) notFound();

  const [rows, relations, settings] = await Promise.all([
    getModuleRows(moduleConfig.model, moduleConfig.defaultSort),
    getRelations(),
    prisma.userSettings.findFirst()
  ]);

  return (
    <AppShell currentWeek={settings?.currentWeek}>
      <TrackerPage module={moduleConfig} initialRows={rows as never[]} relations={relations} />
    </AppShell>
  );
}
export const dynamic = "force-dynamic";
