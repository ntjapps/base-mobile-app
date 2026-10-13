# base_mobile_app

Base mobile app template.

## Running it

Backend settings are build-time `--dart-define`s, kept per backend environment in committed `config/<env>.json` files. Env names match the backend's Laravel env files. There are no compiled-in defaults: `main()` refuses to start (in every build mode) when a required define is missing or `APP_ENV` is not `local|dev|prod`, so a build can never silently talk to another environment's backend.

| File | Backend env | Flavor (Android) |
|---|---|---|
| `config/prod.json` | `.env.prod` | `prod` |
| `config/dev.json` | `.env.dev` | `dev` (applicationId suffix `.staging`, kept for already-installed builds) |
| `config/local.json` | `.env` (local / dev stack) | `local` (suffix `.local`) |

| Define | Purpose |
|---|---|
| `APP_ENV` | `local`, `dev` or `prod` (must match the file name) |
| `APP_API_HOST` | Backend origin, no path |
| `APP_API_VERSION` | Optional API version segment, default `v1` |

The hosts in this repo's files (`api.example.com`, `staging-api.example.com`, `base-app.docker.localhost`) are **template placeholders**: replace them when bootstrapping a new app. The files are committed and everything in them ships inside the APK/IPA, so put public values only (hosts, public OAuth client ids) in them, never a secret.

```bash
flutter run --flavor local --dart-define-from-file=config/local.json
flutter run --flavor dev   --dart-define-from-file=config/dev.json
flutter build apk --release --flavor prod --dart-define-from-file=config/prod.json
flutter build ios --release --dart-define-from-file=config/prod.json   # iOS has no flavor schemes
```

For `stack-config/flutter-device` / `flutter-build`, gitignored `.flutter-run.env` / `.flutter-build.env` (`KEY=value` lines) hold local overrides.

CI: the manual Android build takes a `config` input (`prod` default, or `dev`) used as both the flavor and the config file; the tag publish builds `prod` and `dev`; the iOS build uses `config/prod.json`.

# TODO When Using Template
1. Rename App (app id: `com.ntjapps.<app_name>` on Android and iOS)
2. Reset Version
3. Replace the placeholder hosts in `config/*.json` and delete the env files your backend does not have
