package com.aisystemsbuilder

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class DatabaseInstrumentedTest {
    @Test
    fun seedDataCreatesOfflineRoadmap() = runBlocking {
        val db = Room.inMemoryDatabaseBuilder(ApplicationProvider.getApplicationContext(), AppDatabase::class.java).build()
        val repo = DashboardRepository(db)

        repo.seedIfNeeded()

        val backup = repo.exportBackup()
        assertTrue(backup.contains("Python, GitHub, Files, APIs and Testing"))
        assertTrue(backup.contains("PDF Q&A Bot"))
        db.close()
    }

    @Test
    fun backupRoundTripPreservesDailyLog() = runBlocking {
        val db = Room.inMemoryDatabaseBuilder(ApplicationProvider.getApplicationContext(), AppDatabase::class.java).build()
        val repo = DashboardRepository(db)
        repo.seedIfNeeded()
        repo.saveDailyLog(DailyLogEntity(todaysTarget = "Build Android offline dashboard", buildOutput = "Room backup test", totalMinutes = 90, status = "Done"))

        val backup = repo.exportBackup()
        repo.importBackup(backup)
        val imported = repo.exportBackup()

        assertTrue(imported.contains("Build Android offline dashboard"))
        assertEquals(true, imported.contains("Room backup test"))
        db.close()
    }
}
