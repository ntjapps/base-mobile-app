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

- `version: major.minor.patch` in `pubspec.yaml` — semver only, no `+buildNumber` suffix. The Play Store build number is injected by CI from `github.run_number` (no offset for this repo).
- Two Android flavors: **production** (`com.ntj125app.base_mobile`) and **staging** (`com.ntj125app.base_mobile.staging`).
- `app-android-build.yaml` is manual-only (`workflow_dispatch`) — run it from the Actions tab to build both `production` and `staging` flavors in parallel.
- Tag `v*.*.*` → `app-android-publish.yaml` builds and publishes both flavors to the Play Store internal track. No version-bump PR is opened after publish.
- When keystore secrets or per-flavor service-account secrets are missing, that flavor's build/publish is skipped (not failed). Set `SERVICE_ACCOUNT_JSON_STAGING` to enable staging publish.
- Always pair `--flavor <env>` with `--dart-define=APP_ENV=<env>` in all build commands. The API host is configured in `lib/config/api_config.dart` and falls back to a per-env preset; override at build time with `--dart-define=APP_API_HOST=<url>`.

## Don't

- Put business logic in widgets.
- Use `dynamic` — be explicit.
- Add domain-specific features to this template.
- Skip `flutter analyze` warnings.
