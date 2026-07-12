package com.aisystemsbuilder

import android.app.Application

class AiSystemsBuilderApp : Application() {
    val database: AppDatabase by lazy { AppDatabase.create(this) }
}
