# Flutter Development Skills

## Running the App
Every run and build needs the env's dart-define file (no compiled-in defaults; `config/{local,dev,prod}.json`). On Android the flavor name equals the env name.
```bash
flutter run --flavor local --dart-define-from-file=config/local.json   # debug on connected device
flutter run -d <device-id> --flavor dev --dart-define-from-file=config/dev.json
flutter run --release --flavor prod --dart-define-from-file=config/prod.json
```

## Building
```bash
flutter build apk --release --flavor prod --dart-define-from-file=config/prod.json
flutter build appbundle --release --flavor prod --dart-define-from-file=config/prod.json   # AAB for Play Store
flutter build ios --release --dart-define-from-file=config/prod.json   # iOS (no flavors)
```
Local overrides for `stack-config` tooling: gitignored `.flutter-run.env` / `.flutter-build.env`.

## Store floors
- Android: `targetSdk` 36 (Google Play requirement for new apps and updates since 2026-08-31); `compileSdk` stays pinned to 37 for plugins.
- iOS: deployment target 15.0; builds must use Xcode 26 / the iOS 26 SDK (App Store Connect requirement), see `app-ios-build.yaml`.
- iOS uses the UIScene lifecycle (`FlutterSceneDelegate` in `Info.plist`, plugins registered in `didInitializeImplicitFlutterEngine`), which SDKs after iOS 26 require. `ITSAppUsesNonExemptEncryption` is `false` (HTTPS/Keychain only).

## Testing
```bash
flutter test                         # all tests
flutter test test/widget_test.dart   # single file
flutter test --coverage              # with coverage report
```

## Code Quality
```bash
flutter analyze                      # static analysis (run before every commit)
dart format lib/ test/               # auto-format all Dart files
dart fix --apply                     # apply automated fixes
```

## Dependencies
```bash
flutter pub get                      # install dependencies
flutter pub upgrade                  # upgrade to latest compatible
flutter pub outdated                 # check for newer versions
flutter pub deps                     # dependency tree
```

## Splash Screen
```bash
dart run flutter_native_splash:create   # regenerate splash from pubspec config
```

## Clean Build
```bash
flutter clean && flutter pub get     # wipe build cache and reinstall deps
```

## Device Management
```bash
flutter devices                      # list connected devices/emulators
flutter emulators                    # list available emulators
flutter emulators --launch <id>      # start an emulator
```
