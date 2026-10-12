import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "com.ntj125app.base_mobile"
    // 37 rather than Flutter's default (36): permission_handler_android 13
    // (and flutter_secure_storage 11, where used) compile against android-37.0,
    // which only AGP 9.2+ resolves. targetSdk stays 36.
    compileSdk = 37
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.ntj125app.base_mobile"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        // Google Play requires API 36 for new apps and updates from 2026-08-31.
        targetSdk = 36
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        create("release") {
            try {
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
                storeFile = keystoreProperties["storeFile"]?.let { file(it) }
                storePassword = keystoreProperties["storePassword"] as String
            } catch (e: Exception) {
                println("Release keystore error, skipping release keystore config")
            }
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("debug")
        }
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }

    // -------------------------------------------------------------------------
    // Build flavors: one per environment. The flavor name equals the env name
    // and the config file name (config/<flavor>.json, see README).
    //
    // Build with:
    //   flutter build apk --release --flavor prod \
    //       --dart-define-from-file=config/prod.json
    //   flutter build apk --release --flavor dev \
    //       --dart-define-from-file=config/dev.json
    //   flutter run --flavor local --dart-define-from-file=config/local.json
    //
    // The flavor picks the applicationId; the dart-define file picks the
    // backend. Always pass both, for the same env.
    //
    // Each flavor applies a distinct applicationId so the builds can be
    // installed side-by-side on a tester's device.
    // -------------------------------------------------------------------------
    flavorDimensions += "env"
    productFlavors {
        create("prod") {
            dimension = "env"
            // Same applicationId as defaultConfig: production is canonical.
        }
        create("dev") {
            dimension = "env"
            // Keeps the id of the former "staging" flavor so already-installed
            // builds keep updating in place.
            applicationIdSuffix = ".staging"
            versionNameSuffix = "-staging"
        }
        create("local") {
            dimension = "env"
            applicationIdSuffix = ".local"
            versionNameSuffix = "-local"
        }
    }
}

flutter {
    source = "../.."
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}
