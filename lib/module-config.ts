import {
  BookOpen,
  Bot,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Database,
  FileText,
  Flag,
  Gauge,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  Settings,
  ShieldAlert,
  Sparkles,
  Wrench
} from "lucide-react";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "url"
  | "relation";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  relation?: "weeklyPlan" | "project" | "phase" | "dailyLog";
  placeholder?: string;
};

export type ModuleConfig = {
  key: string;
  model: string;
  title: string;
  description: string;
  iconName: string;
  navGroup: "Command" | "Execution" | "Portfolio" | "System";
  path: string;
  order: number;
  defaultSort: string;
  statusField?: string;
  progressField?: string;
  searchable: string[];
  tableFields: string[];
  fields: FieldConfig[];
};

const statusOptions = ["Not Started", "In Progress", "Blocked", "Review", "Complete"];
const priorityOptions = ["Low", "Medium", "High", "Critical"];
const projectStatus = ["Planned", "In Progress", "Blocked", "Testing", "Polishing", "Published"];

export const modules: ModuleConfig[] = [
  {
    key: "roadmap",
    model: "roadmapPhase",
    title: "Roadmap",
    description: "12-month AI Systems Builder roadmap phases and gate readiness.",
    iconName: "Flag",
    navGroup: "Command",
    path: "/roadmap",
    order: 2,
    defaultSort: "phaseNumber",
    statusField: "status",
    progressField: "progress",
    searchable: ["name", "goal", "coreSkills", "tools"],
    tableFields: ["phaseNumber", "name", "status", "priority", "progress", "goal"],
    fields: [
      { name: "phaseNumber", label: "Phase", type: "number", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "startMonth", label: "Start Month", type: "number" },
      { name: "endMonth", label: "End Month", type: "number" },
      { name: "goal", label: "Goal", type: "textarea", required: true },
      { name: "coreSkills", label: "Core Skills", type: "textarea", required: true },
      { name: "tools", label: "Tools", type: "textarea", required: true },
      { name: "requiredDeliverables", label: "Required Deliverables", type: "textarea", required: true },
      { name: "successCondition", label: "Success Condition", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      { name: "progress", label: "Progress", type: "number" },
      { name: "priority", label: "Priority", type: "select", options: priorityOptions },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "weekly",
    model: "weeklyPlan",
    title: "Weekly Execution",
    description: "24-week execution tracker with proof, blockers, hours, and current sprint details.",
    iconName: "CalendarCheck",
    navGroup: "Execution",
    path: "/weekly",
    order: 3,
    defaultSort: "weekNumber",
    statusField: "status",
    progressField: "progress",
    searchable: ["focus", "topicsToLearn", "buildDeliverable", "repositoryFolder", "nextAction", "blocker"],
    tableFields: ["weekNumber", "month", "focus", "status", "priority", "progress", "actualHours"],
    fields: [
      { name: "weekNumber", label: "Week", type: "number", required: true },
      { name: "month", label: "Month", type: "number", required: true },
      { name: "phaseId", label: "Phase", type: "relation", relation: "phase", required: true },
      { name: "focus", label: "Focus", type: "text", required: true },
      { name: "topicsToLearn", label: "Topics To Learn", type: "textarea", required: true },
      { name: "buildDeliverable", label: "Build Deliverable", type: "textarea", required: true },
      { name: "repositoryFolder", label: "Repository Folder", type: "text" },
      { name: "targetHours", label: "Target Hours", type: "number" },
      { name: "actualHours", label: "Actual Hours", type: "number" },
      { name: "priority", label: "Priority", type: "select", options: priorityOptions },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      { name: "progress", label: "Progress", type: "number" },
      { name: "successCondition", label: "Success Condition", type: "textarea", required: true },
      { name: "proofLinks", label: "Proof Links", type: "textarea" },
      { name: "blocker", label: "Blocker", type: "textarea" },
      { name: "nextAction", label: "Next Action", type: "textarea" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "daily-log",
    model: "dailyLog",
    title: "Daily Log",
    description: "Daily learning and building log. Dates stay blank until manually entered.",
    iconName: "BookOpen",
    navGroup: "Execution",
    path: "/daily-log",
    order: 4,
    defaultSort: "createdAt",
    statusField: "status",
    progressField: "dailyScore",
    searchable: ["todaysTarget", "conceptLearned", "buildOutput", "proofUrl", "blocker", "notes"],
    tableFields: ["date", "day", "status", "totalMinutes", "buildRatio", "dailyProofStatus", "dailyScore"],
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "weeklyPlanId", label: "Week", type: "relation", relation: "weeklyPlan" },
      { name: "day", label: "Day", type: "text" },
      { name: "todaysTarget", label: "Today's Target", type: "textarea" },
      { name: "conceptLearned", label: "Concept Learned", type: "textarea" },
      { name: "buildOutput", label: "Build Output", type: "textarea" },
      { name: "reviewMinutes", label: "Review Minutes", type: "number" },
      { name: "learningMinutes", label: "Learning Minutes", type: "number" },
      { name: "buildingMinutes", label: "Building Minutes", type: "number" },
      { name: "debuggingMinutes", label: "Debugging Minutes", type: "number" },
      { name: "githubCommitDone", label: "GitHub Commit Completed", type: "boolean" },
      { name: "commitUrl", label: "Commit URL", type: "url" },
      { name: "proofType", label: "Proof Type", type: "select", options: ["GitHub commit", "README update", "screenshot", "sample output", "architecture diagram", "demo video", "evaluation report", "exported n8n workflow"] },
      { name: "proofUrl", label: "Proof URL", type: "url" },
      { name: "blocker", label: "Blocker", type: "textarea" },
      { name: "blockerSeverity", label: "Blocker Severity", type: "select", options: priorityOptions },
      { name: "status", label: "Status", type: "select", options: ["Planned", "Logged", "Blocked", "Reviewed"] },
      { name: "dailyScore", label: "Daily Score", type: "number" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "projects",
    model: "project",
    title: "Projects",
    description: "Portfolio projects from planning through published, explainable proof.",
    iconName: "Code2",
    navGroup: "Portfolio",
    path: "/projects",
    order: 5,
    defaultSort: "createdAt",
    statusField: "status",
    progressField: "progress",
    searchable: ["name", "category", "description", "technicalStack", "nextAction", "blocker"],
    tableFields: ["name", "category", "status", "priority", "progress", "portfolioReady"],
    fields: [
      { name: "name", label: "Project Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "targetMonth", label: "Target Month", type: "number" },
      { name: "phaseId", label: "Related Phase", type: "relation", relation: "phase" },
      { name: "problemSolved", label: "Problem Solved", type: "textarea" },
      { name: "targetUser", label: "Target User", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "technicalStack", label: "Technical Stack", type: "textarea", required: true },
      { name: "architecture", label: "Architecture", type: "textarea" },
      { name: "repositoryFolder", label: "Repository Folder", type: "text" },
      { name: "githubUrl", label: "GitHub URL", type: "url" },
      { name: "demoUrl", label: "Demo URL", type: "url" },
      { name: "screenshot", label: "Screenshot URL", type: "url" },
      { name: "status", label: "Status", type: "select", options: projectStatus },
      { name: "progress", label: "Progress", type: "number" },
      { name: "priority", label: "Priority", type: "select", options: priorityOptions },
      { name: "targetCompletionDate", label: "Target Completion Date", type: "date" },
      { name: "actualCompletionDate", label: "Actual Completion Date", type: "date" },
      { name: "nextAction", label: "Next Action", type: "textarea" },
      { name: "blocker", label: "Blocker", type: "textarea" },
      { name: "estimatedHours", label: "Estimated Hours", type: "number" },
      { name: "actualHours", label: "Actual Hours", type: "number" },
      { name: "readmeCompleted", label: "README Completed", type: "boolean" },
      { name: "testsCompleted", label: "Tests Completed", type: "boolean" },
      { name: "loggingCompleted", label: "Logging Completed", type: "boolean" },
      { name: "dockerCompleted", label: "Docker Completed", type: "boolean" },
      { name: "architectureDiagramCompleted", label: "Architecture Diagram Completed", type: "boolean" },
      { name: "demoCompleted", label: "Demo Completed", type: "boolean" },
      { name: "limitationsDocumented", label: "Limitations Documented", type: "boolean" },
      { name: "evaluationCompleted", label: "Evaluation Completed", type: "boolean" },
      { name: "deploymentCompleted", label: "Deployment Completed", type: "boolean" },
      { name: "portfolioReady", label: "Portfolio Ready", type: "boolean" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "tasks",
    model: "projectTask",
    title: "Tasks",
    description: "Next actions, blocked tasks, project work, proof tasks, and review work.",
    iconName: "ListTodo",
    navGroup: "Execution",
    path: "/tasks",
    order: 6,
    defaultSort: "createdAt",
    statusField: "status",
    searchable: ["task", "type", "proofLink", "blocker", "notes"],
    tableFields: ["task", "type", "priority", "status", "dueDate", "estimatedHours", "actualHours"],
    fields: [
      { name: "task", label: "Task", type: "text", required: true },
      { name: "projectId", label: "Related Project", type: "relation", relation: "project" },
      { name: "weeklyPlanId", label: "Related Week", type: "relation", relation: "weeklyPlan" },
      { name: "type", label: "Type", type: "select", options: ["Setup", "Learn", "Build", "Test", "Debug", "Documentation", "Evaluation", "Security", "Deployment", "Proof", "Review"] },
      { name: "priority", label: "Priority", type: "select", options: priorityOptions },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "estimatedHours", label: "Estimated Hours", type: "number" },
      { name: "actualHours", label: "Actual Hours", type: "number" },
      { name: "proofLink", label: "Proof Link", type: "url" },
      { name: "blocker", label: "Blocker", type: "textarea" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "skills",
    model: "skill",
    title: "Skills",
    description: "Capability matrix based on applied proof, not course completion.",
    iconName: "GraduationCap",
    navGroup: "Portfolio",
    path: "/skills",
    order: 7,
    defaultSort: "name",
    statusField: "status",
    progressField: "confidencePercent",
    searchable: ["name", "category", "proofRequired", "proofUrl", "nextPracticeAction"],
    tableFields: ["name", "category", "requiredDepth", "status", "confidencePercent", "hoursInvested"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "requiredDepth", label: "Required Depth", type: "select", options: ["Deep", "Working Knowledge", "Basic", "Later"] },
      { name: "status", label: "Status", type: "select", options: ["Not Started", "Learning", "Practicing", "Applied", "Proven"] },
      { name: "confidencePercent", label: "Confidence", type: "number" },
      { name: "hoursInvested", label: "Hours Invested", type: "number" },
      { name: "proofRequired", label: "Proof Required", type: "textarea" },
      { name: "proofUrl", label: "Proof URL", type: "url" },
      { name: "lastPracticedDate", label: "Last Practiced Date", type: "date" },
      { name: "nextPracticeAction", label: "Next Practice Action", type: "textarea" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "checkpoints",
    model: "checkpoint",
    title: "Checkpoints",
    description: "Month-end checkpoint gates and promotion decisions.",
    iconName: "ClipboardCheck",
    navGroup: "Command",
    path: "/checkpoints",
    order: 8,
    defaultSort: "month",
    statusField: "status",
    searchable: ["title", "requiredProof", "gateResult", "missingRequirements", "decision"],
    tableFields: ["month", "title", "status", "score", "gateResult", "reviewDate"],
    fields: [
      { name: "month", label: "Month", type: "number", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "phaseId", label: "Related Phase", type: "relation", relation: "phase" },
      { name: "requiredProof", label: "Required Proof", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      { name: "reviewDate", label: "Review Date", type: "date" },
      { name: "score", label: "Score", type: "number" },
      { name: "gateResult", label: "Gate Result", type: "textarea" },
      { name: "missingRequirements", label: "Missing Requirements", type: "textarea" },
      { name: "decision", label: "Decision", type: "textarea" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "environment",
    model: "environmentTool",
    title: "Learning Environment",
    description: "Technical tool readiness by category with manual verification dates.",
    iconName: "Wrench",
    navGroup: "System",
    path: "/environment",
    order: 9,
    defaultSort: "category",
    statusField: "status",
    searchable: ["category", "toolName", "purpose", "issue", "fixNotes"],
    tableFields: ["category", "toolName", "status", "verificationStatus", "requirementLevel", "lastCheckedDate"],
    fields: [
      { name: "category", label: "Category", type: "text", required: true },
      { name: "toolName", label: "Tool Name", type: "text", required: true },
      { name: "purpose", label: "Purpose", type: "textarea", required: true },
      { name: "requirementLevel", label: "Requirement Level", type: "select", options: ["Required", "Recommended", "Optional"] },
      { name: "status", label: "Status", type: "select", options: ["Not Installed", "Installed", "Configured", "Verified", "Issue"] },
      { name: "installedVersion", label: "Installed Version", type: "text" },
      { name: "installationLocation", label: "Installation Location", type: "text" },
      { name: "url", label: "URL", type: "url" },
      { name: "configurationPath", label: "Configuration Path", type: "text" },
      { name: "verificationCommand", label: "Verification Command", type: "text" },
      { name: "expectedOutput", label: "Expected Output", type: "text" },
      { name: "verificationStatus", label: "Verification Status", type: "select", options: ["Not Verified", "Verified", "Failed"] },
      { name: "lastCheckedDate", label: "Last Checked Date", type: "date" },
      { name: "issue", label: "Issue", type: "textarea" },
      { name: "fixNotes", label: "Fix Notes", type: "textarea" },
      { name: "documentationUrl", label: "Documentation URL", type: "url" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "weekly-reviews",
    model: "weeklyReview",
    title: "Weekly Reviews",
    description: "Structured review records, correction history, and weekly scores.",
    iconName: "CheckCircle2",
    navGroup: "Execution",
    path: "/weekly-reviews",
    order: 10,
    defaultSort: "createdAt",
    progressField: "weeklyScore",
    searchable: ["whatILearned", "whatIBuilt", "whatWorked", "whatFailed", "oneMainCorrection"],
    tableFields: ["reviewDate", "timeInvested", "weeklyScore", "nextWeekFocus", "oneMainCorrection"],
    fields: [
      { name: "weeklyPlanId", label: "Week", type: "relation", relation: "weeklyPlan" },
      { name: "reviewDate", label: "Review Date", type: "date" },
      { name: "whatILearned", label: "What I Learned", type: "textarea" },
      { name: "whatIBuilt", label: "What I Built", type: "textarea" },
      { name: "whatWorked", label: "What Worked", type: "textarea" },
      { name: "whatFailed", label: "What Failed", type: "textarea" },
      { name: "whatIFixed", label: "What I Fixed", type: "textarea" },
      { name: "githubLinks", label: "GitHub Links", type: "textarea" },
      { name: "screenshots", label: "Screenshots", type: "textarea" },
      { name: "demoLinks", label: "Demo Links", type: "textarea" },
      { name: "blockers", label: "Blockers", type: "textarea" },
      { name: "timeInvested", label: "Time Invested", type: "number" },
      { name: "weeklyScore", label: "Weekly Score", type: "number" },
      { name: "reasonForScore", label: "Reason For Score", type: "textarea" },
      { name: "nextWeekFocus", label: "Next Week Focus", type: "textarea" },
      { name: "oneMainCorrection", label: "One Main Correction", type: "textarea" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "resources",
    model: "learningResource",
    title: "Resources",
    description: "Curated build-oriented resource library without course-hoarding drift.",
    iconName: "FileText",
    navGroup: "System",
    path: "/resources",
    order: 11,
    defaultSort: "title",
    statusField: "status",
    searchable: ["title", "topic", "source", "type", "notes"],
    tableFields: ["title", "topic", "type", "status", "priority", "completedDate"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "topic", label: "Topic", type: "text", required: true },
      { name: "source", label: "Source", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["Documentation", "Course", "Video", "Article", "Repository", "Dataset", "Book", "Tutorial"] },
      { name: "url", label: "URL", type: "url" },
      { name: "phaseId", label: "Related Phase", type: "relation", relation: "phase" },
      { name: "relatedWeek", label: "Related Week", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Queued", "Using Now", "Reference", "Completed", "Archived"] },
      { name: "priority", label: "Priority", type: "select", options: priorityOptions },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "completedDate", label: "Completed Date", type: "date" }
    ]
  },
  {
    key: "proof",
    model: "proofOfWork",
    title: "Proof of Work",
    description: "GitHub commits, READMEs, screenshots, diagrams, demos, evaluations, and workflow exports.",
    iconName: "GitBranch",
    navGroup: "Command",
    path: "/proof",
    order: 12,
    defaultSort: "createdAt",
    searchable: ["title", "type", "url", "summary"],
    tableFields: ["title", "type", "url", "createdAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["GitHub commit", "README update", "screenshot", "sample output", "architecture diagram", "demo video", "evaluation report", "exported n8n workflow"] },
      { name: "url", label: "URL", type: "url" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "dailyLogId", label: "Daily Log", type: "relation", relation: "dailyLog" },
      { name: "projectId", label: "Project", type: "relation", relation: "project" },
      { name: "weeklyPlanId", label: "Week", type: "relation", relation: "weeklyPlan" }
    ]
  },
  {
    key: "blockers",
    model: "blocker",
    title: "Blockers",
    description: "Open risks, stuck points, and next actions.",
    iconName: "ShieldAlert",
    navGroup: "Command",
    path: "/blockers",
    order: 13,
    defaultSort: "createdAt",
    statusField: "status",
    searchable: ["title", "severity", "nextAction", "notes"],
    tableFields: ["title", "severity", "status", "nextAction", "createdAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "severity", label: "Severity", type: "select", options: priorityOptions },
      { name: "status", label: "Status", type: "select", options: ["Open", "Mitigating", "Resolved"] },
      { name: "nextAction", label: "Next Action", type: "textarea" },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "dailyLogId", label: "Daily Log", type: "relation", relation: "dailyLog" },
      { name: "projectId", label: "Project", type: "relation", relation: "project" },
      { name: "weeklyPlanId", label: "Week", type: "relation", relation: "weeklyPlan" }
    ]
  }
];

export const primaryNav = [
  { label: "Command Center", path: "/", iconName: "LayoutDashboard", icon: LayoutDashboard, order: 1 },
  ...modules.map((module) => ({
    label: module.title,
    path: module.path,
    iconName: module.iconName,
    icon: iconByName(module.iconName),
    order: module.order
  })),
  { label: "Settings", path: "/settings", icon: Settings, order: 99 }
].sort((a, b) => a.order - b.order);

export const quickViews = [
  { label: "Portfolio Gallery", path: "/projects", icon: Boxes },
  { label: "Current Sprint", path: "/weekly", icon: Gauge },
  { label: "Environment Health", path: "/environment", icon: Database },
  { label: "Rules Compliance", path: "/settings", icon: Sparkles },
  { label: "Automation Safety", path: "/tasks", icon: Bot }
];

export function getModule(key: string) {
  return modules.find((module) => module.key === key);
}

function iconByName(name: string) {
  const icons = {
    BookOpen,
    CalendarCheck,
    CheckCircle2,
    ClipboardCheck,
    Code2,
    FileText,
    Flag,
    GitBranch,
    GraduationCap,
    ListTodo,
    ShieldAlert,
    Wrench
  } as const;
  return icons[name as keyof typeof icons] ?? Flag;
}
