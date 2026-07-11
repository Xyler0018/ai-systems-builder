import { AlertTriangle, ArrowRight, CheckCircle2, Clock, GitBranch, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ChartCard } from "@/components/charts";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { getDashboardData } from "@/lib/data";
import { quickViews } from "@/lib/module-config";

const dailyStandard = [
  ["Review", "20 minutes"],
  ["Learn", "40 minutes"],
  ["Build", "90 minutes"],
  ["Debug", "20 minutes"],
  ["Proof", "10 minutes"]
];

export default async function DashboardPage() {
  const data = await getDashboardData();
  const current = data.currentSprint;

  return (
    <AppShell currentWeek={data.settings?.currentWeek}>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">AI Systems Builder - Execution Command Center</h1>
            <p className="mt-2 text-muted-foreground">
              AI Engineer / AI Generalist -&gt; RAG + AI Automation Systems Specialist
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickViews.map((view) => (
              <Button key={view.path + view.label} asChild variant="secondary">
                <Link href={view.path}>
                  <view.icon className="h-4 w-4" />
                  {view.label}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {data.kpis.map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs uppercase text-muted-foreground">{kpi.label}</p>
              <p className="mt-3 text-2xl font-semibold">{kpi.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{kpi.helper}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_.8fr]">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Sprint</p>
                <h2 className="mt-1 text-xl font-semibold">
                  Week {current?.weekNumber ?? "Unset"} - {current?.focus ?? "No sprint selected"}
                </h2>
              </div>
              <Badge tone={current?.priority === "Critical" ? "danger" : "gold"}>{current?.status ?? "Unset"}</Badge>
            </div>
            {current && (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <Info label="Month" value={current.month} />
                <Info label="Repository" value={current.repositoryFolder} />
                <Info label="Learning Topics" value={current.topicsToLearn} />
                <Info label="Required Build Output" value={current.buildDeliverable} />
                <Info label="Target Hours" value={current.targetHours} />
                <Info label="Logged Hours" value={current.actualHours} />
                <Info label="Next Action" value={current.nextAction || "Blank"} />
                <Info label="Blocker" value={current.blocker || "None"} />
                <div className="lg:col-span-2">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{current.progress}%</span>
                  </div>
                  <ProgressBar value={current.progress} />
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h2 className="font-semibold">Daily Execution Standard</h2>
            </div>
            <div className="mt-4 space-y-3">
              {dailyStandard.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b pb-2 text-sm last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-md border border-accent/40 bg-accent/10 p-3 text-sm text-accent">
              Never finish a learning day without proof of work.
            </div>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          <Card className="p-5 xl:col-span-2">
            <h2 className="font-semibold">Today&apos;s Execution</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Logged days" value={data.dailyLogs.length} />
              <Info
                label="Missing proof warnings"
                value={data.dailyLogs.filter((log) => log.totalMinutes > 0 && log.dailyProofStatus !== "Verified").length}
              />
              <Info label="Build-heavy days" value={data.dailyLogs.filter((log) => log.buildRatio >= 0.5).length} />
              <Info label="Highest score" value={Math.max(0, ...data.dailyLogs.map((log) => log.dailyScore ?? 0))} />
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Current Checkpoint</h2>
            <p className="mt-3 text-lg">{data.currentCheckpoint?.title ?? "No checkpoint"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.currentCheckpoint?.gateResult ?? "Gate decision not entered."}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Rules Compliance</h2>
            <p className="mt-3 text-3xl font-semibold">{data.compliance.followed}/{data.compliance.total}</p>
            <div className="mt-3"><ProgressBar value={data.compliance.percent} /></div>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Weekly Progress Trend" data={data.charts.weeklyTrend} type="area" keys={["progress"]} />
          <ChartCard title="Study Hours by Week" data={data.charts.weeklyTrend} type="bar" keys={["hours", "target"]} />
          <ChartCard title="Learn vs Build vs Debug Time" data={data.charts.timeByWeek} type="bar" keys={["learn", "build", "debug"]} />
          <ChartCard title="Project Status Distribution" data={data.charts.projectStatus} type="pie" keys={["value"]} />
          <ChartCard title="Skill Confidence by Category" data={data.charts.skillByCategory} type="bar" keys={["confidence"]} />
          <ChartCard title="Environment Readiness" data={data.charts.envReadiness} type="bar" keys={["readiness"]} />
          <ChartCard title="Daily Score Trend" data={data.charts.dailyScoreTrend} type="line" keys={["score"]} />
          <ChartCard title="GitHub Proof Frequency" data={data.charts.proofFrequency} type="bar" keys={["proof"]} />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <Panel title="Active Projects" icon={<Clock className="h-4 w-4" />}>
            {data.projects.filter((project) => ["In Progress", "Testing", "Polishing"].includes(project.status)).slice(0, 5).map((project) => (
              <RowLink key={project.id} href="/projects" title={project.name} meta={`${project.status} - ${project.progress}%`} />
            ))}
          </Panel>
          <Panel title="Blockers" icon={<AlertTriangle className="h-4 w-4" />}>
            {data.blockers.slice(0, 5).map((blocker) => (
              <RowLink key={blocker.id} href="/blockers" title={blocker.title} meta={blocker.severity} />
            ))}
          </Panel>
          <Panel title="Recent Proof of Work" icon={<GitBranch className="h-4 w-4" />}>
            {data.proofs.slice(0, 5).map((proof) => (
              <RowLink key={proof.id} href="/proof" title={proof.title} meta={proof.type} />
            ))}
          </Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-semibold">Next Six Weeks Pipeline</h2>
            <div className="mt-4 space-y-3">
              {data.charts.pipeline.map((item) => (
                <div key={item.week} className="grid grid-cols-[4rem_1fr_4rem] items-center gap-3 text-sm">
                  <Badge>{item.week}</Badge>
                  <span className="truncate text-muted-foreground">{item.focus}</span>
                  <span className="text-right">{item.progress}%</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Portfolio Readiness</h2>
            <div className="mt-4 space-y-3">
              <Readiness label="README complete" count={data.projects.filter((project) => project.readmeCompleted).length} total={data.projects.length} />
              <Readiness label="Tests complete" count={data.projects.filter((project) => project.testsCompleted).length} total={data.projects.length} />
              <Readiness label="Demo complete" count={data.projects.filter((project) => project.demoCompleted).length} total={data.projects.length} />
              <Readiness label="Portfolio ready" count={data.projects.filter((project) => project.portfolioReady).length} total={data.projects.length} />
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-background/50 p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {children || <p className="text-sm text-muted-foreground">No records yet.</p>}
      </div>
    </Card>
  );
}

function RowLink({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm hover:bg-muted">
      <span className="truncate">{title}</span>
      <span className="shrink-0 text-muted-foreground">{meta}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function Readiness({ label, count, total }: { label: string; count: number; total: number }) {
  const value = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{label}</span>
        <span>{count}/{total}</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}
export const dynamic = "force-dynamic";
