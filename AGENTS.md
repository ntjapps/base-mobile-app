# base_mobile_app — Agent Instructions

## Project Overview

This is a **Flutter mobile app template** used as the starting point for all new mobile projects. It provides pre-wired infrastructure: error tracking (Sentry), analytics (Firebase), real-time messaging (Pusher), biometric auth, and CI/CD to the Play Store. When adding features to this template, keep changes generic — avoid domain-specific logic.

## Architecture

### State Management
Use **BLoC + Provider** together:
- `flutter_bloc` for complex business logic and event-driven flows (screens with user interactions, async data loading)
- `provider` for lightweight dependency injection and simple shared state

### Folder Structure (enforce when adding lib/ code)
```
lib/
├── blocs/          # BLoC classes (events, states, blocs)
├── models/         # Plain Dart data models
├── repositories/   # Data access — HTTP, local storage
├── screens/        # Full-page UI widgets
├── widgets/        # Reusable sub-widgets
├── services/       # Side-effect services (auth, push, analytics)
└── utils/          # Pure helpers, extensions, constants
```

### Key Dependencies
| Package | Purpose |
|---|---|
| `sentry_flutter` | Runtime error tracking — wrap app init in `SentryFlutter.init` |
| `firebase_analytics` | User event tracking |
| `firebase_crashlytics` | Native crash reporting |
| `flutter_bloc` | BLoC state management |
| `provider` | DI and simple state |
| `http` | REST API calls |
| `local_auth` | Biometric / device credential auth |
| `pusher_channels_flutter` | Real-time WebSocket events |
| `permission_handler` | Runtime permissions |
| `image_picker` | Camera / gallery access |
| `flutter_native_splash` | Splash screen generation |

## Code Conventions

- **Dart SDK**: null-safe, target `^3.9.2`
- **Quotes**: always single quotes (enforced by linter — `prefer_single_quotes: true`)
- **Naming**: `PascalCase` for classes, `camelCase` for variables/functions, `snake_case` for files
- **Private members**: underscore prefix (`_MyClass`, `_value`)
- **Const**: use `const` and `final` wherever possible
- **Async**: prefer `async/await` over raw `.then()` chains
- **Linting**: `flutter_lints` — run `flutter analyze` before committing

## Testing

- Tests live in `test/` named `*_test.dart`
- Use `flutter_test` package for widget tests
- Run: `flutter test`
- Keep at minimum a smoke test per screen

## Versioning

Format: `major.minor.patch+buildNumber` (e.g. `0.0.3+13`)  
The CI workflow auto-bumps the build number and opens a PR after a successful Play Store publish.

## CI/CD

- Workflows in `.github/workflows/`
- `app-android-build.yaml` — triggered on push/PR, builds debug/release APK
- `app-android-publish.yaml` — triggered on `v*.*.*` tags, publishes AAB to Play Store internal track
- Signing via JKS keystore stored as GitHub secret (`KEYSTORE_BASE64`, `KEY_ALIAS`, `KEY_PASSWORD`, `KEYSTORE_PASSWORD`)
- Java 21, Flutter stable channel, Gradle caching enabled

## Do / Don't

**Do:**
- Initialize Sentry in `main()` wrapping `runApp`
- Use `const` constructors in widget trees
- Follow the folder structure above when adding new code
- Write BLoC events/states as sealed classes

**Don't:**
- Put business logic directly in widgets
- Use `dynamic` types — always be explicit
- Skip `flutter analyze` — fix all warnings before committing
- Add domain-specific features to this template (keep it generic)
