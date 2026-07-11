-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentWeek" INTEGER,
    "currentMonth" INTEGER,
    "weeklyTargetHours" INTEGER NOT NULL DEFAULT 12,
    "studyDaysPerWeek" INTEGER NOT NULL DEFAULT 5,
    "githubProfileUrl" TEXT,
    "mainRepositoryUrl" TEXT,
    "ninetyDayLock" BOOLEAN NOT NULL DEFAULT true,
    "sidebarCollapsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RoadmapPhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phaseNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startMonth" INTEGER,
    "endMonth" INTEGER,
    "goal" TEXT NOT NULL,
    "coreSkills" TEXT NOT NULL,
    "tools" TEXT NOT NULL,
    "requiredDeliverables" TEXT NOT NULL,
    "successCondition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekNumber" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "phaseId" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "topicsToLearn" TEXT NOT NULL,
    "buildDeliverable" TEXT NOT NULL,
    "repositoryFolder" TEXT NOT NULL,
    "targetHours" INTEGER NOT NULL DEFAULT 0,
    "actualHours" REAL NOT NULL DEFAULT 0,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "successCondition" TEXT NOT NULL,
    "proofLinks" TEXT,
    "blocker" TEXT,
    "nextAction" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyPlan_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME,
    "weeklyPlanId" TEXT,
    "day" TEXT,
    "todaysTarget" TEXT,
    "conceptLearned" TEXT,
    "buildOutput" TEXT,
    "reviewMinutes" INTEGER NOT NULL DEFAULT 0,
    "learningMinutes" INTEGER NOT NULL DEFAULT 0,
    "buildingMinutes" INTEGER NOT NULL DEFAULT 0,
    "debuggingMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "githubCommitDone" BOOLEAN NOT NULL DEFAULT false,
    "commitUrl" TEXT,
    "proofType" TEXT,
    "proofUrl" TEXT,
    "blocker" TEXT,
    "blockerSeverity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "dailyScore" INTEGER,
    "buildRatio" REAL NOT NULL DEFAULT 0,
    "dailyProofStatus" TEXT NOT NULL DEFAULT 'Missing',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyLog_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetMonth" INTEGER,
    "phaseId" TEXT,
    "problemSolved" TEXT,
    "targetUser" TEXT,
    "description" TEXT NOT NULL,
    "technicalStack" TEXT NOT NULL,
    "architecture" TEXT,
    "repositoryFolder" TEXT,
    "githubUrl" TEXT,
    "demoUrl" TEXT,
    "screenshot" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "targetCompletionDate" DATETIME,
    "actualCompletionDate" DATETIME,
    "nextAction" TEXT,
    "blocker" TEXT,
    "estimatedHours" REAL NOT NULL DEFAULT 0,
    "actualHours" REAL NOT NULL DEFAULT 0,
    "readmeCompleted" BOOLEAN NOT NULL DEFAULT false,
    "testsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "loggingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "dockerCompleted" BOOLEAN NOT NULL DEFAULT false,
    "architectureDiagramCompleted" BOOLEAN NOT NULL DEFAULT false,
    "demoCompleted" BOOLEAN NOT NULL DEFAULT false,
    "limitationsDocumented" BOOLEAN NOT NULL DEFAULT false,
    "evaluationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "deploymentCompleted" BOOLEAN NOT NULL DEFAULT false,
    "portfolioReady" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "task" TEXT NOT NULL,
    "projectId" TEXT,
    "weeklyPlanId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'Build',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "dueDate" DATETIME,
    "estimatedHours" REAL NOT NULL DEFAULT 0,
    "actualHours" REAL NOT NULL DEFAULT 0,
    "proofLink" TEXT,
    "blocker" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProjectTask_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requiredDepth" TEXT NOT NULL DEFAULT 'Working Knowledge',
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "confidencePercent" INTEGER NOT NULL DEFAULT 0,
    "hoursInvested" REAL NOT NULL DEFAULT 0,
    "proofRequired" TEXT,
    "proofUrl" TEXT,
    "lastPracticedDate" DATETIME,
    "nextPracticeAction" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "phaseId" TEXT,
    "requiredProof" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "reviewDate" DATETIME,
    "score" INTEGER,
    "gateResult" TEXT,
    "missingRequirements" TEXT,
    "decision" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Checkpoint_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnvironmentTool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "requirementLevel" TEXT NOT NULL DEFAULT 'Required',
    "status" TEXT NOT NULL DEFAULT 'Not Installed',
    "installedVersion" TEXT,
    "installationLocation" TEXT,
    "url" TEXT,
    "configurationPath" TEXT,
    "verificationCommand" TEXT,
    "expectedOutput" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'Not Verified',
    "lastCheckedDate" DATETIME,
    "issue" TEXT,
    "fixNotes" TEXT,
    "documentationUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyPlanId" TEXT,
    "reviewDate" DATETIME,
    "whatILearned" TEXT,
    "whatIBuilt" TEXT,
    "whatWorked" TEXT,
    "whatFailed" TEXT,
    "whatIFixed" TEXT,
    "githubLinks" TEXT,
    "screenshots" TEXT,
    "demoLinks" TEXT,
    "blockers" TEXT,
    "timeInvested" REAL NOT NULL DEFAULT 0,
    "weeklyScore" INTEGER,
    "reasonForScore" TEXT,
    "nextWeekFocus" TEXT,
    "oneMainCorrection" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyReview_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "phaseId" TEXT,
    "relatedWeek" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "notes" TEXT,
    "completedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearningResource_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProofOfWork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "summary" TEXT,
    "dailyLogId" TEXT,
    "projectId" TEXT,
    "weeklyPlanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProofOfWork_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "DailyLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProofOfWork_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProofOfWork_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Execution',
    "isFollowed" BOOLEAN NOT NULL DEFAULT false,
    "evidence" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Blocker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "nextAction" TEXT,
    "notes" TEXT,
    "dailyLogId" TEXT,
    "projectId" TEXT,
    "weeklyPlanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Blocker_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "DailyLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Blocker_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Blocker_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectWeek" (
    "projectId" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,

    PRIMARY KEY ("projectId", "weeklyPlanId"),
    CONSTRAINT "ProjectWeek_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectWeek_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillWeek" (
    "skillId" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,

    PRIMARY KEY ("skillId", "weeklyPlanId"),
    CONSTRAINT "SkillWeek_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkillWeek_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "WeeklyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillProject" (
    "skillId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    PRIMARY KEY ("skillId", "projectId"),
    CONSTRAINT "SkillProject_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkillProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillPhase" (
    "skillId" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,

    PRIMARY KEY ("skillId", "phaseId"),
    CONSTRAINT "SkillPhase_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkillPhase_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapPhase_phaseNumber_key" ON "RoadmapPhase"("phaseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPlan_weekNumber_key" ON "WeeklyPlan"("weekNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_order_key" ON "Rule"("order");

