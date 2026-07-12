package com.aisystemsbuilder

import android.app.Application
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Today
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.LocalDate

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AiSystemsBuilderTheme {
                DashboardApp()
            }
        }
    }
}

@Composable
fun AiSystemsBuilderTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFF22D3EE),
            secondary = Color(0xFFA7F3D0),
            background = Color(0xFF07111F),
            surface = Color(0xFF0F172A),
            surfaceVariant = Color(0xFF162033),
            onPrimary = Color(0xFF031018),
            onBackground = Color(0xFFE5EEF8),
            onSurface = Color(0xFFE5EEF8)
        ),
        content = content
    )
}

enum class ModuleRoute(val label: String, val icon: ImageVector) {
    Home("Command", Icons.Default.Dashboard),
    Roadmap("Roadmap", Icons.Default.Flag),
    Weekly("Weekly", Icons.Default.Today),
    Daily("Daily", Icons.Default.Book),
    Projects("Projects", Icons.Default.Build),
    Skills("Skills", Icons.Default.CheckCircle),
    Resources("Resources", Icons.Default.Book),
    Tools("Tools", Icons.Default.Build),
    Rules("Rules", Icons.Default.CheckCircle),
    Checkpoints("Checks", Icons.Default.Flag),
    Settings("Settings", Icons.Default.Settings)
}

data class DashboardUiState(
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
    val reviews: List<WeeklyReviewEntity> = emptyList(),
    val proofs: List<ProofOfWorkEntity> = emptyList(),
    val blockers: List<BlockerEntity> = emptyList()
)

class DashboardViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = DashboardRepository((application as AiSystemsBuilderApp).database)

    val state: StateFlow<DashboardUiState> = combine(
        repository.settings,
        repository.phases,
        repository.weeks,
        repository.dailyLogs,
        repository.projects,
        repository.projectTasks,
        repository.skills,
        repository.resources,
        repository.tools,
        repository.rules,
        repository.checkpoints,
        repository.weeklyReviews,
        repository.proofs,
        repository.blockers
    ) { values ->
        DashboardUiState(
            settings = values[0] as List<UserSettingsEntity>,
            phases = values[1] as List<RoadmapPhaseEntity>,
            weeks = values[2] as List<WeeklyPlanEntity>,
            dailyLogs = values[3] as List<DailyLogEntity>,
            projects = values[4] as List<ProjectEntity>,
            projectTasks = values[5] as List<ProjectTaskEntity>,
            skills = values[6] as List<SkillEntity>,
            resources = values[7] as List<LearningResourceEntity>,
            tools = values[8] as List<EnvironmentToolEntity>,
            rules = values[9] as List<RuleEntity>,
            checkpoints = values[10] as List<CheckpointEntity>,
            reviews = values[11] as List<WeeklyReviewEntity>,
            proofs = values[12] as List<ProofOfWorkEntity>,
            blockers = values[13] as List<BlockerEntity>
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), DashboardUiState())

    init {
        viewModelScope.launch { repository.seedIfNeeded() }
    }

    fun saveDailyLog(log: DailyLogEntity) = viewModelScope.launch { repository.saveDailyLog(log) }
    fun saveWeek(week: WeeklyPlanEntity) = viewModelScope.launch { repository.saveWeek(week) }
    fun savePhase(phase: RoadmapPhaseEntity) = viewModelScope.launch { repository.savePhase(phase) }
    fun saveProject(project: ProjectEntity) = viewModelScope.launch { repository.saveProject(project) }
    fun saveTask(task: ProjectTaskEntity) = viewModelScope.launch { repository.saveTask(task) }
    fun saveSkill(skill: SkillEntity) = viewModelScope.launch { repository.saveSkill(skill) }
    fun saveResource(resource: LearningResourceEntity) = viewModelScope.launch { repository.saveResource(resource) }
    fun saveTool(tool: EnvironmentToolEntity) = viewModelScope.launch { repository.saveTool(tool) }
    fun saveRule(rule: RuleEntity) = viewModelScope.launch { repository.saveRule(rule) }
    fun saveCheckpoint(checkpoint: CheckpointEntity) = viewModelScope.launch { repository.saveCheckpoint(checkpoint) }
    fun saveReview(review: WeeklyReviewEntity) = viewModelScope.launch { repository.saveReview(review) }
    fun saveProof(proof: ProofOfWorkEntity) = viewModelScope.launch { repository.saveProof(proof) }
    fun saveBlocker(blocker: BlockerEntity) = viewModelScope.launch { repository.saveBlocker(blocker) }
    fun exportBackup(onReady: (String) -> Unit) = viewModelScope.launch { onReady(repository.exportBackup()) }
    fun importBackup(raw: String, onDone: (String) -> Unit) = viewModelScope.launch {
        runCatching { repository.importBackup(raw) }
            .onSuccess { onDone("Backup imported.") }
            .onFailure { onDone("Import failed: ${it.message}") }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardApp(vm: DashboardViewModel = viewModel()) {
    val state by vm.state.collectAsState()
    var selected by remember { mutableStateOf(ModuleRoute.Home) }
    var showAddDaily by remember { mutableStateOf(false) }
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                Text("AI Systems Builder", modifier = Modifier.padding(20.dp), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                ModuleRoute.entries.forEach { route ->
                    NavigationDrawerItem(
                        label = { Text(route.label) },
                        icon = { Icon(route.icon, null) },
                        selected = selected == route,
                        onClick = {
                            selected = route
                            scope.launch { drawerState.close() }
                        }
                    )
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text(selected.label) },
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Default.Menu, contentDescription = "Modules")
                        }
                    }
                )
            },
            bottomBar = {
                NavigationBar {
                    listOf(ModuleRoute.Home, ModuleRoute.Roadmap, ModuleRoute.Weekly, ModuleRoute.Daily, ModuleRoute.Settings).forEach { route ->
                        NavigationBarItem(
                            selected = selected == route,
                            onClick = { selected = route },
                            icon = { Icon(route.icon, null) },
                            label = { Text(route.label) }
                        )
                    }
                }
            },
            floatingActionButton = {
                if (selected == ModuleRoute.Daily) {
                    FloatingActionButton(onClick = { showAddDaily = true }) {
                        Icon(Icons.Default.Add, contentDescription = "Add daily log")
                    }
                }
            }
        ) { padding ->
            Surface(Modifier.fillMaxSize().padding(padding), color = MaterialTheme.colorScheme.background) {
                when (selected) {
                    ModuleRoute.Home -> CommandCenter(state)
                    ModuleRoute.Roadmap -> RoadmapScreen(state, vm)
                    ModuleRoute.Weekly -> WeeklyScreen(state, vm)
                    ModuleRoute.Daily -> DailyScreen(state, vm, onAdd = { showAddDaily = true })
                    ModuleRoute.Projects -> ProjectsScreen(state, vm)
                    ModuleRoute.Skills -> SkillsScreen(state, vm)
                    ModuleRoute.Resources -> ResourcesScreen(state, vm)
                    ModuleRoute.Tools -> ToolsScreen(state, vm)
                    ModuleRoute.Rules -> RulesScreen(state, vm)
                    ModuleRoute.Checkpoints -> CheckpointsScreen(state, vm)
                    ModuleRoute.Settings -> SettingsScreen(state, vm)
                }
            }
        }
    }

    if (showAddDaily) {
        DailyLogDialog(
            weeks = state.weeks,
            onDismiss = { showAddDaily = false },
            onSave = {
                vm.saveDailyLog(it)
                showAddDaily = false
            }
        )
    }
}

@Composable
fun CommandCenter(state: DashboardUiState) {
    val totalMinutes = state.dailyLogs.sumOf { it.totalMinutes }
    val avgProgress = state.weeks.takeIf { it.isNotEmpty() }?.map { it.progress }?.average()?.toInt() ?: 0
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { HeroCard("AI Systems Builder", "Offline local dashboard for executing the 12-month course plan.") }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                MetricCard("Weeks", state.weeks.size.toString(), Modifier.weight(1f))
                MetricCard("Projects", state.projects.size.toString(), Modifier.weight(1f))
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                MetricCard("Hours", "%.1f".format(totalMinutes / 60.0), Modifier.weight(1f))
                MetricCard("Avg progress", "$avgProgress%", Modifier.weight(1f))
            }
        }
        item { SectionTitle("Current Focus") }
        items(state.weeks.take(4)) { week -> WeekCard(week, onSave = {}) }
        item { SectionTitle("Recent Daily Logs") }
        items(state.dailyLogs.take(5)) { log -> DailyLogCard(log) }
    }
}

@Composable
fun RoadmapScreen(state: DashboardUiState, vm: DashboardViewModel) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(state.phases) { phase ->
            ProgressCard(
                title = "Phase ${phase.phaseNumber}: ${phase.name}",
                subtitle = phase.goal,
                status = phase.status,
                progress = phase.progress,
                onProgress = { vm.savePhase(phase.copy(progress = it)) },
                onStatus = { vm.savePhase(phase.copy(status = nextStatus(phase.status))) }
            )
        }
    }
}

@Composable
fun WeeklyScreen(state: DashboardUiState, vm: DashboardViewModel) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(state.weeks) { week ->
            WeekCard(week, onSave = { vm.saveWeek(it) })
        }
    }
}

@Composable
fun DailyScreen(state: DashboardUiState, vm: DashboardViewModel, onAdd: () -> Unit) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Button(onClick = onAdd) { Icon(Icons.Default.Add, null); Spacer(Modifier.width(8.dp)); Text("Add daily log") } }
        items(state.dailyLogs) { log -> DailyLogCard(log) }
        item { SectionTitle("Weekly Reviews") }
        item { QuickReviewCard(onSave = { vm.saveReview(it) }) }
        items(state.reviews) { review -> InfoCard(review.reviewDate ?: "Review", review.whatIBuilt ?: review.notes ?: "No review details yet.", review.nextWeekFocus ?: "Next focus unset") }
    }
}

@Composable
fun ProjectsScreen(state: DashboardUiState, vm: DashboardViewModel) {
    var showAdd by remember { mutableStateOf(false) }
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Button(onClick = { showAdd = true }) { Icon(Icons.Default.Add, null); Spacer(Modifier.width(8.dp)); Text("Add project") } }
        items(state.projects) { project ->
            ProgressCard(project.name, project.description, project.status, project.progress, { vm.saveProject(project.copy(progress = it)) }, { vm.saveProject(project.copy(status = nextStatus(project.status))) })
        }
        item { SectionTitle("Project Tasks") }
        item { QuickTaskCard(state.projects, state.weeks, onSave = { vm.saveTask(it) }) }
        items(state.projectTasks) { task -> InfoCard(task.task, task.status, task.notes ?: task.proofLink ?: "No notes") }
    }
    if (showAdd) ProjectDialog(onDismiss = { showAdd = false }, onSave = { vm.saveProject(it); showAdd = false })
}

@Composable
fun SkillsScreen(state: DashboardUiState, vm: DashboardViewModel) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(state.skills) { skill ->
            ProgressCard(skill.name, "${skill.category} • ${skill.requiredDepth}", skill.status, skill.confidencePercent, { vm.saveSkill(skill.copy(confidencePercent = it)) }, { vm.saveSkill(skill.copy(status = nextStatus(skill.status))) })
        }
    }
}

@Composable
fun ResourcesScreen(state: DashboardUiState, vm: DashboardViewModel) {
    var showAdd by remember { mutableStateOf(false) }
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Button(onClick = { showAdd = true }) { Icon(Icons.Default.Add, null); Spacer(Modifier.width(8.dp)); Text("Add resource") } }
        items(state.resources) { resource ->
            InfoCard(resource.title, "${resource.topic} • ${resource.source}", resource.status, action = { vm.saveResource(resource.copy(status = nextStatus(resource.status))) })
        }
    }
    if (showAdd) ResourceDialog(onDismiss = { showAdd = false }, onSave = { vm.saveResource(it); showAdd = false })
}

@Composable
fun ToolsScreen(state: DashboardUiState, vm: DashboardViewModel) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(state.tools) { tool ->
            InfoCard(tool.toolName, "${tool.category} • ${tool.requirementLevel}", tool.status, action = { vm.saveTool(tool.copy(status = nextToolStatus(tool.status))) })
        }
    }
}

@Composable
fun RulesScreen(state: DashboardUiState, vm: DashboardViewModel) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(state.rules) { rule ->
            InfoCard("${rule.order}. ${rule.text}", rule.category, if (rule.isFollowed) "Followed" else "Needs proof", action = { vm.saveRule(rule.copy(isFollowed = !rule.isFollowed)) })
        }
    }
}

@Composable
fun CheckpointsScreen(state: DashboardUiState, vm: DashboardViewModel) {
    LazyColumn(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(state.checkpoints) { checkpoint ->
            InfoCard("Month ${checkpoint.month}: ${checkpoint.title}", checkpoint.requiredProof, checkpoint.status, action = { vm.saveCheckpoint(checkpoint.copy(status = nextStatus(checkpoint.status))) })
        }
        item { SectionTitle("Proofs and Blockers") }
        item { QuickProofCard(onSave = { vm.saveProof(it) }) }
        item { QuickBlockerCard(onSave = { vm.saveBlocker(it) }) }
        items(state.proofs) { proof -> InfoCard(proof.title, proof.type, proof.url ?: proof.summary ?: "No link") }
        items(state.blockers) { blocker -> InfoCard(blocker.title, blocker.severity, blocker.status) }
    }
}

@Composable
fun SettingsScreen(state: DashboardUiState, vm: DashboardViewModel) {
    val context = androidx.compose.ui.platform.LocalContext.current
    var exportText by remember { mutableStateOf("") }
    var importText by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }
    Column(Modifier.padding(16.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        HeroCard("Local-first Android data", "This phone keeps its own Room SQLite database. No Docker, server, login, or cloud database is required.")
        MetricCard("Records", (state.phases.size + state.weeks.size + state.dailyLogs.size + state.projects.size + state.skills.size).toString(), Modifier.fillMaxWidth())
        Button(onClick = {
            vm.exportBackup { raw ->
                exportText = raw
                copyToClipboard(context, "AI Systems Builder Backup", raw)
                message = "Backup copied to clipboard."
            }
        }) { Icon(Icons.Default.Save, null); Spacer(Modifier.width(8.dp)); Text("Export backup JSON") }
        OutlinedTextField(exportText, onValueChange = { exportText = it }, label = { Text("Exported backup JSON") }, minLines = 4, modifier = Modifier.fillMaxWidth())
        Divider()
        OutlinedTextField(importText, onValueChange = { importText = it }, label = { Text("Paste backup JSON to import") }, minLines = 4, modifier = Modifier.fillMaxWidth())
        Button(enabled = importText.isNotBlank(), onClick = { vm.importBackup(importText) { message = it } }) { Text("Import backup JSON") }
        if (message.isNotBlank()) Text(message, color = MaterialTheme.colorScheme.secondary)
    }
}

@Composable
fun HeroCard(title: String, body: String) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant), shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(body, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.78f))
        }
    }
}

@Composable
fun MetricCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(modifier = modifier, shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp)) {
            Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
            Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun SectionTitle(text: String) {
    Text(text, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 8.dp))
}

@Composable
fun ProgressCard(title: String, subtitle: String, status: String, progress: Int, onProgress: (Int) -> Unit, onStatus: () -> Unit) {
    Card(shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Text(subtitle, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.72f), maxLines = 3, overflow = TextOverflow.Ellipsis)
            Row(verticalAlignment = Alignment.CenterVertically) {
                AssistChip(onClick = onStatus, label = { Text(status) })
                Spacer(Modifier.width(12.dp))
                Text("$progress%")
            }
            Slider(value = progress.toFloat(), onValueChange = { onProgress(it.toInt()) }, valueRange = 0f..100f)
        }
    }
}

@Composable
fun WeekCard(week: WeeklyPlanEntity, onSave: (WeeklyPlanEntity) -> Unit) {
    ProgressCard(
        title = "Week ${week.weekNumber}: ${week.focus}",
        subtitle = "${week.topicsToLearn}\nBuild: ${week.buildDeliverable}",
        status = week.status,
        progress = week.progress,
        onProgress = { onSave(week.copy(progress = it)) },
        onStatus = { onSave(week.copy(status = nextStatus(week.status))) }
    )
}

@Composable
fun DailyLogCard(log: DailyLogEntity) {
    InfoCard(log.date, log.todaysTarget ?: "No target", "${log.status} • ${log.totalMinutes} min • ${log.dailyProofStatus}")
}

@Composable
fun InfoCard(title: String, subtitle: String, meta: String, action: (() -> Unit)? = null) {
    Card(shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            Text(subtitle, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.72f), maxLines = 4, overflow = TextOverflow.Ellipsis)
            Row(verticalAlignment = Alignment.CenterVertically) {
                AssistChip(onClick = action ?: {}, enabled = action != null, label = { Text(meta) })
            }
        }
    }
}

@Composable
fun DailyLogDialog(weeks: List<WeeklyPlanEntity>, onDismiss: () -> Unit, onSave: (DailyLogEntity) -> Unit) {
    var target by remember { mutableStateOf("") }
    var learned by remember { mutableStateOf("") }
    var built by remember { mutableStateOf("") }
    var minutes by remember { mutableStateOf("90") }
    val week = weeks.firstOrNull()
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add daily log") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(target, { target = it }, label = { Text("Today's target") })
                OutlinedTextField(learned, { learned = it }, label = { Text("Concept learned") })
                OutlinedTextField(built, { built = it }, label = { Text("Build output") })
                OutlinedTextField(minutes, { minutes = it.filter(Char::isDigit) }, label = { Text("Building minutes") })
            }
        },
        confirmButton = {
            TextButton(onClick = {
                val buildMinutes = minutes.toIntOrNull() ?: 0
                onSave(
                    DailyLogEntity(
                        weeklyPlanId = week?.id,
                        day = LocalDate.now().dayOfWeek.name.lowercase().replaceFirstChar { it.uppercase() },
                        todaysTarget = target,
                        conceptLearned = learned,
                        buildOutput = built,
                        buildingMinutes = buildMinutes,
                        totalMinutes = buildMinutes,
                        status = "Done",
                        dailyProofStatus = if (built.isBlank()) "Missing" else "Present"
                    )
                )
            }) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}

@Composable
fun ProjectDialog(onDismiss: () -> Unit, onSave: (ProjectEntity) -> Unit) {
    var name by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add project") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(name, { name = it }, label = { Text("Project name") })
                OutlinedTextField(description, { description = it }, label = { Text("Description") })
            }
        },
        confirmButton = {
            TextButton(enabled = name.isNotBlank(), onClick = {
                onSave(ProjectEntity(id = newId("project"), name = name, category = "Custom", description = description.ifBlank { "Custom project" }, technicalStack = "To be defined"))
            }) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}

@Composable
fun ResourceDialog(onDismiss: () -> Unit, onSave: (LearningResourceEntity) -> Unit) {
    var title by remember { mutableStateOf("") }
    var topic by remember { mutableStateOf("") }
    var source by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add resource") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(title, { title = it }, label = { Text("Title") })
                OutlinedTextField(topic, { topic = it }, label = { Text("Topic") })
                OutlinedTextField(source, { source = it }, label = { Text("Source") })
            }
        },
        confirmButton = {
            TextButton(enabled = title.isNotBlank(), onClick = {
                onSave(LearningResourceEntity(id = newId("resource"), title = title, topic = topic.ifBlank { "General" }, source = source.ifBlank { "Manual" }, type = "Custom"))
            }) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}

@Composable
fun QuickTaskCard(projects: List<ProjectEntity>, weeks: List<WeeklyPlanEntity>, onSave: (ProjectTaskEntity) -> Unit) {
    var task by remember { mutableStateOf("") }
    Card(shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Quick task", fontWeight = FontWeight.Bold)
            OutlinedTextField(task, { task = it }, label = { Text("Task") }, modifier = Modifier.fillMaxWidth())
            Button(enabled = task.isNotBlank(), onClick = { onSave(ProjectTaskEntity(task = task, projectId = projects.firstOrNull()?.id, weeklyPlanId = weeks.firstOrNull()?.id)); task = "" }) { Text("Save task") }
        }
    }
}

@Composable
fun QuickReviewCard(onSave: (WeeklyReviewEntity) -> Unit) {
    var built by remember { mutableStateOf("") }
    var focus by remember { mutableStateOf("") }
    Card(shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Quick weekly review", fontWeight = FontWeight.Bold)
            OutlinedTextField(built, { built = it }, label = { Text("What I built") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(focus, { focus = it }, label = { Text("Next focus") }, modifier = Modifier.fillMaxWidth())
            Button(enabled = built.isNotBlank(), onClick = { onSave(WeeklyReviewEntity(whatIBuilt = built, nextWeekFocus = focus)); built = ""; focus = "" }) { Text("Save review") }
        }
    }
}

@Composable
fun QuickProofCard(onSave: (ProofOfWorkEntity) -> Unit) {
    var title by remember { mutableStateOf("") }
    var url by remember { mutableStateOf("") }
    Card(shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Quick proof", fontWeight = FontWeight.Bold)
            OutlinedTextField(title, { title = it }, label = { Text("Proof title") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(url, { url = it }, label = { Text("URL or note") }, modifier = Modifier.fillMaxWidth())
            Button(enabled = title.isNotBlank(), onClick = { onSave(ProofOfWorkEntity(title = title, type = "Manual", url = url.ifBlank { null })); title = ""; url = "" }) { Text("Save proof") }
        }
    }
}

@Composable
fun QuickBlockerCard(onSave: (BlockerEntity) -> Unit) {
    var title by remember { mutableStateOf("") }
    Card(shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Quick blocker", fontWeight = FontWeight.Bold)
            OutlinedTextField(title, { title = it }, label = { Text("Blocker") }, modifier = Modifier.fillMaxWidth())
            Button(enabled = title.isNotBlank(), onClick = { onSave(BlockerEntity(title = title)); title = "" }) { Text("Save blocker") }
        }
    }
}

fun nextStatus(status: String): String = when (status) {
    "Not Started", "Queued", "Planned" -> "In Progress"
    "In Progress" -> "Done"
    "Done", "Completed" -> "Not Started"
    else -> "In Progress"
}

fun nextToolStatus(status: String): String = when (status) {
    "Not Installed" -> "Installed"
    "Installed" -> "Verified"
    "Verified" -> "Not Installed"
    else -> "Installed"
}

fun copyToClipboard(context: Context, label: String, text: String) {
    val manager = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    manager.setPrimaryClip(ClipData.newPlainText(label, text))
}
