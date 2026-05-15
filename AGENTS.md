# base_mobile_app — Agent Instructions

A **Flutter mobile app template** — the starting point for new mobile projects. Pre-wires error tracking (Sentry), analytics + crash reporting (Firebase), real-time events (Pusher), biometric auth, and Android Play Store CI/CD. Keep changes generic — no domain-specific logic.

> Shell commands and CI details live in `.github/skills/flutter.md` and `.github/skills/android.md` (auto-loaded via `CLAUDE.md`). `pubspec.yaml` is the source of truth for dependencies.

## Architecture

- **State management**: `flutter_bloc` for event-driven screen logic; `provider` for lightweight DI and shared state.
- **Folder layout** under `lib/`:
  - `blocs/` events/states/blocs · `models/` plain data · `repositories/` HTTP + local storage
  - `screens/` full pages · `widgets/` reusable UI · `services/` side effects (auth, push, analytics) · `utils/` pure helpers

## Conventions

- Dart SDK `^3.9.2`, null-safe.
- **Single quotes** (`prefer_single_quotes`); `PascalCase` classes, `camelCase` members, `snake_case` files, `_` prefix for private.
- Prefer `const` / `final`; prefer `async`/`await` over `.then()`.
- BLoC events and states as sealed classes.
- Initialize Sentry in `main()` around `runApp`.
- `flutter analyze` must be clean before every commit.

## Testing

`test/*_test.dart` with `flutter_test`. At minimum a smoke test per screen.

## Versioning & CI

- `version: major.minor.patch+buildNumber` in `pubspec.yaml`. The `+buildNumber` is what Play Store uses and must be monotonically increasing.
- Push to any branch → `app-android-build.yaml` builds debug/release APK.
- Tag `v*.*.*` → `app-android-publish.yaml` ships an AAB to the Play Store internal track and opens a PR to bump the build number.

## Don't

- Put business logic in widgets.
- Use `dynamic` — be explicit.
- Add domain-specific features to this template.
- Skip `flutter analyze` warnings.
