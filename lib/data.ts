import { prisma } from "@/lib/prisma";
import { percent, serialize } from "@/lib/utils";
import { modules } from "@/lib/module-config";

type PrismaDelegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique?: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

export function getDelegate(model: string): PrismaDelegate {
  if (!modules.some((module) => module.model === model)) throw new Error(`Unknown model: ${model}`);
  const delegate = (prisma as unknown as Record<string, PrismaDelegate>)[model];
  if (!delegate) throw new Error(`Unknown model: ${model}`);
  return delegate;
}

export async function getRelations() {
  const [phases, weeks, projects, dailyLogs] = await Promise.all([
    prisma.roadmapPhase.findMany({ orderBy: { phaseNumber: "asc" }, select: { id: true, phaseNumber: true, name: true } }),
    prisma.weeklyPlan.findMany({ orderBy: { weekNumber: "asc" }, select: { id: true, weekNumber: true, focus: true } }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.dailyLog.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, date: true, todaysTarget: true } })
  ]);

  return serialize({
    phases: phases.map((phase) => ({ id: phase.id, label: `Phase ${phase.phaseNumber}: ${phase.name}` })),
    weeklyPlans: weeks.map((week) => ({ id: week.id, label: `Week ${week.weekNumber}: ${week.focus}` })),
    projects: projects.map((project) => ({ id: project.id, label: project.name })),
    dailyLogs: dailyLogs.map((log) => ({
      id: log.id,
      label: log.date ? new Date(log.date).toISOString().slice(0, 10) : log.todaysTarget || "Daily log"
    }))
  });
}

export async function getModuleRows(model: string, defaultSort: string) {
  const delegate = getDelegate(model);
  const rows = await delegate.findMany({
    orderBy: { [defaultSort]: defaultSort === "createdAt" ? "desc" : "asc" }
  });
  return serialize(rows);
}

export async function getDashboardData() {
  const [
    settings,
    phases,
    weeks,
    dailyLogs,
    projects,
    skills,
    envTools,
    checkpoints,
    proofs,
    blockers,
    rules,
    reviews
  ] = await Promise.all([
    prisma.userSettings.findFirst(),
    prisma.roadmapPhase.findMany({ orderBy: { phaseNumber: "asc" } }),
    prisma.weeklyPlan.findMany({ orderBy: { weekNumber: "asc" } }),
    prisma.dailyLog.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.skill.findMany({ orderBy: { name: "asc" } }),
    prisma.environmentTool.findMany({ orderBy: [{ category: "asc" }, { toolName: "asc" }] }),
    prisma.checkpoint.findMany({ orderBy: { month: "asc" } }),
    prisma.proofOfWork.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.blocker.findMany({ where: { status: { not: "Resolved" } }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.rule.findMany({ orderBy: { order: "asc" } }),
    prisma.weeklyReview.findMany({ orderBy: { createdAt: "asc" } })
  ]);

  const totalHours = dailyLogs.reduce((sum, log) => sum + log.totalMinutes / 60, 0);
  const projectHours = projects.reduce((sum, project) => sum + project.actualHours, 0);
  const overallProgress = percent(
    phases.reduce((sum, phase) => sum + phase.progress, 0) +
      weeks.reduce((sum, week) => sum + week.progress, 0) +
      projects.reduce((sum, project) => sum + project.progress, 0),
    (phases.length + weeks.length + projects.length) * 100
  );

  const currentWeekNumber =
    settings?.currentWeek ?? weeks.find((week) => week.status === "In Progress")?.weekNumber ?? 1;
  const currentSprint = weeks.find((week) => week.weekNumber === currentWeekNumber) ?? weeks[0];
  const currentCheckpoint =
    checkpoints.find((checkpoint) => checkpoint.status !== "Complete") ?? checkpoints[0];

  const weeklyTrend = weeks.map((week) => ({
    name: `W${week.weekNumber}`,
    progress: week.progress,
    target: week.targetHours,
    hours: week.actualHours
  }));

  const timeByWeek = weeks.map((week) => {
    const logs = dailyLogs.filter((log) => log.weeklyPlanId === week.id);
    return {
      name: `W${week.weekNumber}`,
      learn: logs.reduce((sum, log) => sum + log.learningMinutes, 0) / 60,
      build: logs.reduce((sum, log) => sum + log.buildingMinutes, 0) / 60,
      debug: logs.reduce((sum, log) => sum + log.debuggingMinutes, 0) / 60
    };
  });

  const projectStatus = Object.entries(
    projects.reduce<Record<string, number>>((acc, project) => {
      acc[project.status] = (acc[project.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const skillByCategory = Object.entries(
    skills.reduce<Record<string, { total: number; count: number }>>((acc, skill) => {
      acc[skill.category] ??= { total: 0, count: 0 };
      acc[skill.category].total += skill.confidencePercent;
      acc[skill.category].count += 1;
      return acc;
    }, {})
  ).map(([category, value]) => ({
    category,
    confidence: value.count ? Math.round(value.total / value.count) : 0
  }));

  const envReadiness = Object.entries(
    envTools.reduce<Record<string, { verified: number; total: number }>>((acc, tool) => {
      acc[tool.category] ??= { verified: 0, total: 0 };
      acc[tool.category].verified += tool.status === "Verified" || tool.verificationStatus === "Verified" ? 1 : 0;
      acc[tool.category].total += 1;
      return acc;
    }, {})
  ).map(([category, value]) => ({
    category,
    readiness: percent(value.verified, value.total)
  }));

  const dailyScoreTrend = dailyLogs
    .filter((log) => log.dailyScore !== null)
    .slice(-30)
    .map((log, index) => ({
      name: log.date ? new Date(log.date).toISOString().slice(5, 10) : `Log ${index + 1}`,
      score: log.dailyScore ?? 0
    }));

  const proofFrequency = weeks.map((week) => ({
    name: `W${week.weekNumber}`,
    proof: proofs.filter((proof) => proof.weeklyPlanId === week.id).length
  }));

  const pipeline = weeks
    .filter((week) => week.weekNumber >= currentWeekNumber)
    .slice(0, 6)
    .map((week) => ({ week: `W${week.weekNumber}`, focus: week.focus, progress: week.progress }));

  const complianceCount = rules.filter((rule) => rule.isFollowed).length;
  const proofCount = await prisma.proofOfWork.count();

  return serialize({
    settings,
    kpis: [
      { label: "Overall Progress", value: `${overallProgress}%`, helper: "Roadmap, weekly, and project progress" },
      { label: "Total Hours Logged", value: (totalHours + projectHours).toFixed(1), helper: "Daily logs plus project actual hours" },
      { label: "Projects Published", value: projects.filter((project) => project.status === "Published").length, helper: "Published portfolio projects" },
      { label: "Environment Tools Verified", value: envTools.filter((tool) => tool.status === "Verified" || tool.verificationStatus === "Verified").length, helper: `${envTools.length} tracked tools` },
      { label: "Current Learning Streak", value: calculateStreak(dailyLogs), helper: "Consecutive logged date entries" },
      { label: "GitHub Proof Entries", value: proofCount, helper: "Stored proof-of-work records" }
    ],
    currentSprint,
    currentCheckpoint,
    phases,
    weeks,
    dailyLogs,
    projects,
    skills,
    envTools,
    checkpoints,
    proofs,
    blockers,
    rules,
    reviews,
    compliance: { followed: complianceCount, total: rules.length, percent: percent(complianceCount, rules.length) },
    charts: {
      weeklyTrend,
      timeByWeek,
      projectStatus,
      skillByCategory,
      envReadiness,
      dailyScoreTrend,
      proofFrequency,
      pipeline
    }
  });
}

export async function getBackup() {
  const entries = await Promise.all(
    modules.map(async (module) => [module.model, await getDelegate(module.model).findMany()])
  );
  const settings = await prisma.userSettings.findMany();
  const rules = await prisma.rule.findMany();
  return serialize({ exportedAt: null, settings, rules, data: Object.fromEntries(entries) });
}

function calculateStreak(logs: { date: Date | null; totalMinutes: number }[]) {
  const dated = logs
    .filter((log) => log.date && log.totalMinutes > 0)
    .map((log) => new Date(log.date as Date).toISOString().slice(0, 10))
    .sort()
    .reverse();

  if (!dated.length) return 0;
  let streak = 1;
  for (let index = 1; index < dated.length; index += 1) {
    const previous = new Date(dated[index - 1]);
    const current = new Date(dated[index]);
    const diff = (previous.getTime() - current.getTime()) / 86400000;
    if (diff === 1) streak += 1;
    else if (diff > 1) break;
  }
  return streak;
}
