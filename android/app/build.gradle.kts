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
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.ntj125app.base_mobile"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = 35
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
    // Build flavors — production vs staging.
    //
    // Build with:
    //   flutter build apk --release --flavor production -t lib/main.dart
    //   flutter build apk --release --flavor staging    -t lib/main.dart
    //   flutter run --flavor staging
    //
    // Each flavor applies a distinct applicationId so prod + staging APKs
    // can be installed side-by-side on a tester's device.
    //
    // Per-key overrides (APP_API_HOST, APP_API_VERSION, etc.) can be supplied
    // at the command line and override the env preset in ApiConfig.
    // -------------------------------------------------------------------------
    flavorDimensions += "env"
    productFlavors {
        create("production") {
            dimension = "env"
            // Same applicationId as defaultConfig — production is canonical.
        }
        create("staging") {
            dimension = "env"
            applicationIdSuffix = ".staging"
            versionNameSuffix = "-staging"
        }
    }
}

flutter {
    source = "../.."
}

// NOTE: per-flavor --dart-define is injected by the Flutter CLI, not Gradle.
// Always pair --flavor with the matching --dart-define:
//
//   flutter build apk --release --flavor production \
//       --dart-define=APP_ENV=production
//
//   flutter build apk --release --flavor staging \
//       --dart-define=APP_ENV=staging
//
// To override the API host at build time (optional — falls back to preset):
//
//   flutter build apk --release --flavor staging \
//       --dart-define=APP_ENV=staging \
//       --dart-define=APP_API_HOST=https://custom-staging.example.com
//
// CI workflows under .github/workflows/ pair --flavor and --dart-define
// automatically. The --flavor switch picks the applicationId; --dart-define
// picks the API host.
