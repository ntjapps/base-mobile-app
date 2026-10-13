@.github/skills/flutter.md
@.github/skills/android.md

# base_mobile_app — Agent Instructions

A **Flutter mobile app template** — the starting point for new mobile projects. Pre-wires error tracking (Sentry), analytics + crash reporting (Firebase), real-time events (Pusher), biometric auth, and Android Play Store CI/CD. Keep changes generic — no domain-specific logic.

## App identifier

- **New apps** created from this template use the org prefix **`com.ntjapps.`** — e.g. Android `applicationId`/`namespace` `com.ntjapps.<app_name>`, iOS bundle ID `com.ntjapps.<appName>`; move `MainActivity.kt` to the matching package path.
- **Already-published apps keep their existing id** (store listings can't change it). This template itself is published as `com.ntj125app.base_mobile` — never rename it. Only change an existing app's id when the user confirms it is unpublished.

## Environments (`config/<env>.json`)

Backend settings live in committed dart-define files, one per backend environment, named after the backend's Laravel env file: `config/local.json` (`.env`), `config/dev.json` (`.env.dev`), `config/prod.json` (`.env.prod`). Apps bootstrapped from this template keep only the files whose backend env exists. Code: `lib/config/api_config.dart`; test: `test/config_test.dart`.

- **Public values only** (API host, public PKCE OAuth client id = the backend's mobile client id). Every define is readable inside the APK/IPA, so never put a secret in these files or in the app at all; secrets stay on the backend, signing material in GitHub Secrets.
- **No compiled-in backend defaults.** `main()` calls `ApiConfig.ensureConfigured()` and the app refuses to start (all build modes) when a required define (`APP_ENV`, `APP_API_HOST`) is missing or `APP_ENV` is not `local|dev|prod`, so a build can never silently talk to another environment's backend. `APP_API_VERSION` is optional (default `v1`).
- **Every build passes the file:** `flutter run|build ... --dart-define-from-file=config/<env>.json`. CI build workflows take a `config` input (default `prod`); tag publish builds `prod` (and `dev`, as before). With flavors, flavor name == env name (never change an existing app's id to rename one).
- Local overrides for `stack-config/flutter-device` / `flutter-build` go in `.flutter-run.env` / `.flutter-build.env`, gitignored.
- Changing a backend's mobile client id means updating that env's `config/<env>.json` in the same change.
- The values in this template's files (`api.example.com`, `staging-api.example.com`, `base-app.docker.localhost`) are placeholders: replace them when bootstrapping a new app.

> Shell commands and CI details live in `.github/skills/flutter.md` and `.github/skills/android.md` (auto-loaded via the imports at the top of this file). `pubspec.yaml` is the source of truth for dependencies.

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
- `main()` calls `ApiConfig.ensureConfigured()` first, then initializes Sentry around `runApp`.
- `flutter analyze` must be clean before every commit.

## Testing

`test/*_test.dart` with `flutter_test`. At minimum a smoke test per screen.

## Don't

- Put business logic in widgets.
- Use `dynamic` — be explicit.
- Add domain-specific features to this template.
- Skip `flutter analyze` warnings.
