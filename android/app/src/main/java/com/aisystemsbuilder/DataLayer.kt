package com.aisystemsbuilder

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Upsert
import androidx.room.withTransaction
import kotlinx.serialization.decodeFromString
import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

fun newId(prefix: String) = "$prefix-${UUID.randomUUID()}"
fun nowIso(): String = Instant.now().toString()
fun todayIso(): String = LocalDate.now().toString()

@Serializable
@Entity(tableName = "settings")
data class UserSettingsEntity(
    @PrimaryKey val id: String = "default-settings",
    val currentWeek: Int? = 1,
    val currentMonth: Int? = 1,
    val weeklyTargetHours: Int = 12,
    val studyDaysPerWeek: Int = 5,
    val githubProfileUrl: String? = null,
    val mainRepositoryUrl: String? = null,
    val ninetyDayLock: Boolean = true,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "roadmap_phases")
data class RoadmapPhaseEntity(
    @PrimaryKey val id: String,
    val phaseNumber: Int,
    val name: String,
    val startMonth: Int? = null,
    val endMonth: Int? = null,
    val goal: String,
    val coreSkills: String,
    val tools: String,
    val requiredDeliverables: String,
    val successCondition: String,
    val status: String = "Not Started",
    val progress: Int = 0,
    val priority: String = "Medium",
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "weekly_plans")
data class WeeklyPlanEntity(
    @PrimaryKey val id: String,
    val weekNumber: Int,
    val month: Int,
    val phaseId: String,
    val focus: String,
    val topicsToLearn: String,
    val buildDeliverable: String,
    val repositoryFolder: String,
    val targetHours: Int = 12,
    val actualHours: Double = 0.0,
    val priority: String = "Medium",
    val status: String = "Not Started",
    val progress: Int = 0,
    val successCondition: String,
    val proofLinks: String? = null,
    val blocker: String? = null,
    val nextAction: String? = null,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "daily_logs")
data class DailyLogEntity(
    @PrimaryKey val id: String = newId("daily"),
    val date: String = todayIso(),
    val weeklyPlanId: String? = null,
    val day: String? = null,
    val todaysTarget: String? = null,
    val conceptLearned: String? = null,
    val buildOutput: String? = null,
    val reviewMinutes: Int = 0,
    val learningMinutes: Int = 0,
    val buildingMinutes: Int = 0,
    val debuggingMinutes: Int = 0,
    val totalMinutes: Int = reviewMinutes + learningMinutes + buildingMinutes + debuggingMinutes,
    val githubCommitDone: Boolean = false,
    val commitUrl: String? = null,
    val proofType: String? = null,
    val proofUrl: String? = null,
    val blocker: String? = null,
    val blockerSeverity: String? = null,
    val status: String = "Planned",
    val dailyScore: Int? = null,
    val buildRatio: Double = if (totalMinutes > 0) buildingMinutes.toDouble() / totalMinutes else 0.0,
    val dailyProofStatus: String = "Missing",
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "projects")
data class ProjectEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val targetMonth: Int? = null,
    val phaseId: String? = null,
    val problemSolved: String? = null,
    val targetUser: String? = null,
    val description: String,
    val technicalStack: String,
    val architecture: String? = null,
    val repositoryFolder: String? = null,
    val githubUrl: String? = null,
    val demoUrl: String? = null,
    val status: String = "Planned",
    val progress: Int = 0,
    val priority: String = "Medium",
    val nextAction: String? = null,
    val blocker: String? = null,
    val estimatedHours: Double = 0.0,
    val actualHours: Double = 0.0,
    val portfolioReady: Boolean = false,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "project_tasks")
data class ProjectTaskEntity(
    @PrimaryKey val id: String = newId("task"),
    val task: String,
    val projectId: String? = null,
    val weeklyPlanId: String? = null,
    val type: String = "Build",
    val priority: String = "Medium",
    val status: String = "Not Started",
    val dueDate: String? = null,
    val estimatedHours: Double = 0.0,
    val actualHours: Double = 0.0,
    val proofLink: String? = null,
    val blocker: String? = null,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "skills")
data class SkillEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val requiredDepth: String = "Working Knowledge",
    val status: String = "Not Started",
    val confidencePercent: Int = 0,
    val hoursInvested: Double = 0.0,
    val proofRequired: String? = null,
    val proofUrl: String? = null,
    val lastPracticedDate: String? = null,
    val nextPracticeAction: String? = null,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "learning_resources")
data class LearningResourceEntity(
    @PrimaryKey val id: String,
    val title: String,
    val topic: String,
    val source: String,
    val type: String,
    val url: String? = null,
    val phaseId: String? = null,
    val relatedWeek: Int? = null,
    val status: String = "Queued",
    val priority: String = "Medium",
    val notes: String? = null,
    val completedDate: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "environment_tools")
data class EnvironmentToolEntity(
    @PrimaryKey val id: String,
    val category: String,
    val toolName: String,
    val purpose: String,
    val requirementLevel: String = "Required",
    val status: String = "Not Installed",
    val installedVersion: String? = null,
    val installationLocation: String? = null,
    val url: String? = null,
    val verificationCommand: String? = null,
    val expectedOutput: String? = null,
    val verificationStatus: String = "Not Verified",
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "rules")
data class RuleEntity(
    @PrimaryKey val id: String,
    val order: Int,
    val text: String,
    val category: String = "Execution",
    val isFollowed: Boolean = false,
    val evidence: String? = null,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "checkpoints")
data class CheckpointEntity(
    @PrimaryKey val id: String,
    val month: Int,
    val title: String,
    val phaseId: String? = null,
    val requiredProof: String,
    val status: String = "Not Started",
    val reviewDate: String? = null,
    val score: Int? = null,
    val gateResult: String? = null,
    val missingRequirements: String? = null,
    val decision: String? = null,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "weekly_reviews")
data class WeeklyReviewEntity(
    @PrimaryKey val id: String = newId("review"),
    val weeklyPlanId: String? = null,
    val reviewDate: String? = todayIso(),
    val whatILearned: String? = null,
    val whatIBuilt: String? = null,
    val blockers: String? = null,
    val timeInvested: Double = 0.0,
    val weeklyScore: Int? = null,
    val nextWeekFocus: String? = null,
    val notes: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "proofs")
data class ProofOfWorkEntity(
    @PrimaryKey val id: String = newId("proof"),
    val title: String,
    val type: String,
    val url: String? = null,
    val summary: String? = null,
    val dailyLogId: String? = null,
    val projectId: String? = null,
    val weeklyPlanId: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
@Entity(tableName = "blockers")
data class BlockerEntity(
    @PrimaryKey val id: String = newId("blocker"),
    val title: String,
    val severity: String = "Medium",
    val status: String = "Open",
    val nextAction: String? = null,
    val notes: String? = null,
    val dailyLogId: String? = null,
    val projectId: String? = null,
    val weeklyPlanId: String? = null,
    val createdAt: String = nowIso(),
    val updatedAt: String = nowIso()
)

@Serializable
data class BackupPayload(
    val exportedAt: String = nowIso(),
    val settings: List<UserSettingsEntity> = emptyList(),
    val phases: List<RoadmapPhaseEntity> = emptyList(),
    val weeks: List<WeeklyPlanEntity> = emptyList(),
    val dailyLogs: List<DailyLogEntity> = emptyList(),
    val projects: List<ProjectEntity> = emptyList(),
    val projectTasks: List<ProjectTaskEntity> = emptyList(),
    val skills: List<SkillEntity> = emptyList(),
    val resources: List<LearningResourceEntity> = emptyList(),
    val tools: List<EnvironmentToolEntity> = emptyList(),
    val rules: List<RuleEntity> = emptyList(),
    val checkpoints: List<CheckpointEntity> = emptyList(),
    val weeklyReviews: List<WeeklyReviewEntity> = emptyList(),
    val proofs: List<ProofOfWorkEntity> = emptyList(),
    val blockers: List<BlockerEntity> = emptyList()
)

@Dao
interface DashboardDao {
    @Query("SELECT * FROM settings")
    fun settingsFlow(): Flow<List<UserSettingsEntity>>

    @Query("SELECT * FROM roadmap_phases ORDER BY phaseNumber")
    fun phasesFlow(): Flow<List<RoadmapPhaseEntity>>

    @Query("SELECT * FROM weekly_plans ORDER BY weekNumber")
    fun weeksFlow(): Flow<List<WeeklyPlanEntity>>

    @Query("SELECT * FROM daily_logs ORDER BY date DESC, createdAt DESC")
    fun dailyLogsFlow(): Flow<List<DailyLogEntity>>

    @Query("SELECT * FROM projects ORDER BY targetMonth, name")
    fun projectsFlow(): Flow<List<ProjectEntity>>

    @Query("SELECT * FROM project_tasks ORDER BY createdAt DESC")
    fun projectTasksFlow(): Flow<List<ProjectTaskEntity>>

    @Query("SELECT * FROM skills ORDER BY category, name")
    fun skillsFlow(): Flow<List<SkillEntity>>

    @Query("SELECT * FROM learning_resources ORDER BY topic, title")
    fun resourcesFlow(): Flow<List<LearningResourceEntity>>

    @Query("SELECT * FROM environment_tools ORDER BY category, toolName")
    fun toolsFlow(): Flow<List<EnvironmentToolEntity>>

    @Query("SELECT * FROM rules ORDER BY `order`")
    fun rulesFlow(): Flow<List<RuleEntity>>

    @Query("SELECT * FROM checkpoints ORDER BY month")
    fun checkpointsFlow(): Flow<List<CheckpointEntity>>

    @Query("SELECT * FROM weekly_reviews ORDER BY reviewDate DESC")
    fun weeklyReviewsFlow(): Flow<List<WeeklyReviewEntity>>

    @Query("SELECT * FROM proofs ORDER BY createdAt DESC")
    fun proofsFlow(): Flow<List<ProofOfWorkEntity>>

    @Query("SELECT * FROM blockers ORDER BY createdAt DESC")
    fun blockersFlow(): Flow<List<BlockerEntity>>

    @Query("SELECT * FROM settings")
    suspend fun settings(): List<UserSettingsEntity>
    @Query("SELECT * FROM roadmap_phases")
    suspend fun phases(): List<RoadmapPhaseEntity>
    @Query("SELECT * FROM weekly_plans")
    suspend fun weeks(): List<WeeklyPlanEntity>
    @Query("SELECT * FROM daily_logs")
    suspend fun dailyLogs(): List<DailyLogEntity>
    @Query("SELECT * FROM projects")
    suspend fun projects(): List<ProjectEntity>
    @Query("SELECT * FROM project_tasks")
    suspend fun projectTasks(): List<ProjectTaskEntity>
    @Query("SELECT * FROM skills")
    suspend fun skills(): List<SkillEntity>
    @Query("SELECT * FROM learning_resources")
    suspend fun resources(): List<LearningResourceEntity>
    @Query("SELECT * FROM environment_tools")
    suspend fun tools(): List<EnvironmentToolEntity>
    @Query("SELECT * FROM rules")
    suspend fun rules(): List<RuleEntity>
    @Query("SELECT * FROM checkpoints")
    suspend fun checkpoints(): List<CheckpointEntity>
    @Query("SELECT * FROM weekly_reviews")
    suspend fun weeklyReviews(): List<WeeklyReviewEntity>
    @Query("SELECT * FROM proofs")
    suspend fun proofs(): List<ProofOfWorkEntity>
    @Query("SELECT * FROM blockers")
    suspend fun blockers(): List<BlockerEntity>

    @Query("SELECT COUNT(*) FROM roadmap_phases")
    suspend fun phaseCount(): Int

    @Upsert suspend fun upsertSettings(items: List<UserSettingsEntity>)
    @Upsert suspend fun upsertPhases(items: List<RoadmapPhaseEntity>)
    @Upsert suspend fun upsertWeeks(items: List<WeeklyPlanEntity>)
    @Upsert suspend fun upsertDailyLogs(items: List<DailyLogEntity>)
    @Upsert suspend fun upsertProjects(items: List<ProjectEntity>)
    @Upsert suspend fun upsertProjectTasks(items: List<ProjectTaskEntity>)
    @Upsert suspend fun upsertSkills(items: List<SkillEntity>)
    @Upsert suspend fun upsertResources(items: List<LearningResourceEntity>)
    @Upsert suspend fun upsertTools(items: List<EnvironmentToolEntity>)
    @Upsert suspend fun upsertRules(items: List<RuleEntity>)
    @Upsert suspend fun upsertCheckpoints(items: List<CheckpointEntity>)
    @Upsert suspend fun upsertWeeklyReviews(items: List<WeeklyReviewEntity>)
    @Upsert suspend fun upsertProofs(items: List<ProofOfWorkEntity>)
    @Upsert suspend fun upsertBlockers(items: List<BlockerEntity>)

    @Query("DELETE FROM settings") suspend fun clearSettings()
    @Query("DELETE FROM roadmap_phases") suspend fun clearPhases()
    @Query("DELETE FROM weekly_plans") suspend fun clearWeeks()
    @Query("DELETE FROM daily_logs") suspend fun clearDailyLogs()
    @Query("DELETE FROM projects") suspend fun clearProjects()
    @Query("DELETE FROM project_tasks") suspend fun clearProjectTasks()
    @Query("DELETE FROM skills") suspend fun clearSkills()
    @Query("DELETE FROM learning_resources") suspend fun clearResources()
    @Query("DELETE FROM environment_tools") suspend fun clearTools()
    @Query("DELETE FROM rules") suspend fun clearRules()
    @Query("DELETE FROM checkpoints") suspend fun clearCheckpoints()
    @Query("DELETE FROM weekly_reviews") suspend fun clearWeeklyReviews()
    @Query("DELETE FROM proofs") suspend fun clearProofs()
    @Query("DELETE FROM blockers") suspend fun clearBlockers()
}

@Database(
    entities = [
        UserSettingsEntity::class,
        RoadmapPhaseEntity::class,
        WeeklyPlanEntity::class,
        DailyLogEntity::class,
        ProjectEntity::class,
        ProjectTaskEntity::class,
        SkillEntity::class,
        LearningResourceEntity::class,
        EnvironmentToolEntity::class,
        RuleEntity::class,
        CheckpointEntity::class,
        WeeklyReviewEntity::class,
        ProofOfWorkEntity::class,
        BlockerEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dashboardDao(): DashboardDao

    companion object {
        fun create(context: Context): AppDatabase =
            Room.databaseBuilder(context, AppDatabase::class.java, "ai-systems-builder.db").build()
    }
}

class DashboardRepository(private val db: AppDatabase) {
    private val dao = db.dashboardDao()
    private val json = Json { prettyPrint = true; ignoreUnknownKeys = true }

    val settings = dao.settingsFlow()
    val phases = dao.phasesFlow()
    val weeks = dao.weeksFlow()
    val dailyLogs = dao.dailyLogsFlow()
    val projects = dao.projectsFlow()
    val projectTasks = dao.projectTasksFlow()
    val skills = dao.skillsFlow()
    val resources = dao.resourcesFlow()
    val tools = dao.toolsFlow()
    val rules = dao.rulesFlow()
    val checkpoints = dao.checkpointsFlow()
    val weeklyReviews = dao.weeklyReviewsFlow()
    val proofs = dao.proofsFlow()
    val blockers = dao.blockersFlow()

    suspend fun seedIfNeeded() {
        if (dao.phaseCount() > 0) return
        db.withTransaction {
            dao.upsertSettings(listOf(UserSettingsEntity()))
            dao.upsertPhases(SeedData.phases)
            dao.upsertWeeks(SeedData.weeks)
            dao.upsertProjects(SeedData.projects)
            dao.upsertSkills(SeedData.skills)
            dao.upsertResources(SeedData.resources)
            dao.upsertTools(SeedData.tools)
            dao.upsertRules(SeedData.rules)
            dao.upsertCheckpoints(SeedData.checkpoints)
        }
    }

    suspend fun exportBackup(): String = json.encodeToString(
        BackupPayload(
            settings = dao.settings(),
            phases = dao.phases(),
            weeks = dao.weeks(),
            dailyLogs = dao.dailyLogs(),
            projects = dao.projects(),
            projectTasks = dao.projectTasks(),
            skills = dao.skills(),
            resources = dao.resources(),
            tools = dao.tools(),
            rules = dao.rules(),
            checkpoints = dao.checkpoints(),
            weeklyReviews = dao.weeklyReviews(),
            proofs = dao.proofs(),
            blockers = dao.blockers()
        )
    )

    suspend fun importBackup(raw: String) {
        val payload = json.decodeFromString<BackupPayload>(raw)
        db.withTransaction {
            dao.clearBlockers()
            dao.clearProofs()
            dao.clearWeeklyReviews()
            dao.clearCheckpoints()
            dao.clearRules()
            dao.clearTools()
            dao.clearResources()
            dao.clearSkills()
            dao.clearProjectTasks()
            dao.clearProjects()
            dao.clearDailyLogs()
            dao.clearWeeks()
            dao.clearPhases()
            dao.clearSettings()
            dao.upsertSettings(payload.settings.ifEmpty { listOf(UserSettingsEntity()) })
            dao.upsertPhases(payload.phases)
            dao.upsertWeeks(payload.weeks)
            dao.upsertDailyLogs(payload.dailyLogs)
            dao.upsertProjects(payload.projects)
            dao.upsertProjectTasks(payload.projectTasks)
            dao.upsertSkills(payload.skills)
            dao.upsertResources(payload.resources)
            dao.upsertTools(payload.tools)
            dao.upsertRules(payload.rules)
            dao.upsertCheckpoints(payload.checkpoints)
            dao.upsertWeeklyReviews(payload.weeklyReviews)
            dao.upsertProofs(payload.proofs)
            dao.upsertBlockers(payload.blockers)
        }
    }

    suspend fun saveDailyLog(log: DailyLogEntity) = dao.upsertDailyLogs(listOf(log.copy(updatedAt = nowIso())))
    suspend fun saveWeek(week: WeeklyPlanEntity) = dao.upsertWeeks(listOf(week.copy(updatedAt = nowIso())))
    suspend fun savePhase(phase: RoadmapPhaseEntity) = dao.upsertPhases(listOf(phase.copy(updatedAt = nowIso())))
    suspend fun saveProject(project: ProjectEntity) = dao.upsertProjects(listOf(project.copy(updatedAt = nowIso())))
    suspend fun saveTask(task: ProjectTaskEntity) = dao.upsertProjectTasks(listOf(task.copy(updatedAt = nowIso())))
    suspend fun saveSkill(skill: SkillEntity) = dao.upsertSkills(listOf(skill.copy(updatedAt = nowIso())))
    suspend fun saveResource(resource: LearningResourceEntity) = dao.upsertResources(listOf(resource.copy(updatedAt = nowIso())))
    suspend fun saveTool(tool: EnvironmentToolEntity) = dao.upsertTools(listOf(tool.copy(updatedAt = nowIso())))
    suspend fun saveRule(rule: RuleEntity) = dao.upsertRules(listOf(rule.copy(updatedAt = nowIso())))
    suspend fun saveCheckpoint(checkpoint: CheckpointEntity) = dao.upsertCheckpoints(listOf(checkpoint.copy(updatedAt = nowIso())))
    suspend fun saveReview(review: WeeklyReviewEntity) = dao.upsertWeeklyReviews(listOf(review.copy(updatedAt = nowIso())))
    suspend fun saveProof(proof: ProofOfWorkEntity) = dao.upsertProofs(listOf(proof.copy(updatedAt = nowIso())))
    suspend fun saveBlocker(blocker: BlockerEntity) = dao.upsertBlockers(listOf(blocker.copy(updatedAt = nowIso())))
}
