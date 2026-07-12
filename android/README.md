# AI Systems Builder Android

Native offline Android companion app for the AI Systems Builder course and dashboard.

## Architecture

- Kotlin
- Jetpack Compose
- Material 3
- Room SQLite
- Kotlin serialization
- AndroidX Navigation

The Android app keeps a separate local SQLite database on the phone. It does not require Docker, the desktop dashboard, a cloud database, or a login.

## Open In Android Studio

1. Open Android Studio.
2. Choose **Open**.
3. Select this folder:

```text
android/
```

4. Let Android Studio sync Gradle.
5. Run the `app` configuration on an emulator or Android device.

If Android Studio asks for an Android SDK, install the recommended SDK and build tools.

## Data

The app seeds the roadmap locally on first launch. User-entered data stays on the phone in Room SQLite.

Use Settings to export/import a JSON backup for manual transfer between desktop and Android.
