# Android Build & Publish Skills

## Flavors

Two build flavors are configured:

| Flavor | applicationId | versionNameSuffix |
|---|---|---|
| `production` | `com.ntj125app.base_mobile` | _(none)_ |
| `staging` | `com.ntj125app.base_mobile.staging` | `-staging` |

Build with `--flavor production` or `--flavor staging`. Always pair `--flavor` with the matching `--dart-define=APP_ENV=<flavor>`. Both flavors run in CI on every tag push.

## Local Debug Build
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

## Local Release Build (requires keystore)
```bash
flutter build apk --release --flavor production --dart-define=APP_ENV=production
flutter build apk --release --flavor staging    --dart-define=APP_ENV=staging
flutter build appbundle --release --flavor production --dart-define=APP_ENV=production
flutter build appbundle --release --flavor staging    --dart-define=APP_ENV=staging
# AAB output: build/app/outputs/bundle/<flavor>Release/app-<flavor>-release.aab
```

## Signing Setup
The keystore is expected at `android/keystore.jks`. In CI it is decoded from the `KEYSTORE_BASE64` secret. For local signing, set in `android/key.properties`:
```
storePassword=<password>
keyPassword=<password>
keyAlias=<alias>
storeFile=../keystore.jks
```

## CI Workflow Triggers

### Build only (no publish)
- Push to `main` branch or manual dispatch
- Workflow: `.github/workflows/app-android-build.yaml`
- Runs `build-production` and `build-staging` jobs in parallel

### Publish to Play Store
- Create and push a version tag: `git tag v1.2.3 && git push origin v1.2.3`
- Workflow: `.github/workflows/app-android-publish.yaml`
- Publishes both flavors to **internal track** as draft releases (when secrets are present)
- After production publish success, a PR is auto-opened to bump the build number in `pubspec.yaml`
- Staging publish does NOT trigger a version bump

## Skip-on-missing-secret behavior
- If `KEYSTORE_BASE64` is absent, the build steps are skipped (job still runs, reports a notice).
- If `SERVICE_ACCOUNT_JSON` is absent, production publish is skipped.
- If `SERVICE_ACCOUNT_JSON_STAGING` is absent, staging publish is skipped.
- Missing secrets never cause the workflow to fail — they are silently skipped with a `::notice::` log line.

## Version Management
Version is in `pubspec.yaml`:
```yaml
version: 0.0.3+13   # semver+buildNumber
```
- The `+buildNumber` is what the Play Store uses (must be monotonically increasing)
- CI auto-increments the build number during production publish

## Required GitHub Secrets
| Secret | Description | Required |
|---|---|---|
| `KEYSTORE_BASE64` | Base64-encoded JKS keystore file | Recommended |
| `KEY_ALIAS` | Keystore key alias | Recommended |
| `KEY_PASSWORD` | Key password | Recommended |
| `KEYSTORE_PASSWORD` | Keystore password | Recommended |
| `SERVICE_ACCOUNT_JSON` | GCP service account JSON for production Play Store | Optional |
| `SERVICE_ACCOUNT_JSON_STAGING` | GCP service account JSON for staging Play Store | Optional |

## Optional GitHub Variables (per-flavor endpoint overrides)

Set under repo Settings → Variables → Actions. Empty/unset means "use the
preset baked into `lib/config/api_config.dart`". URLs are non-sensitive so
Variables (not Secrets) are the right home.

| Variable | `--dart-define` injected | Flavor |
|---|---|---|
| `API_HOST_PRODUCTION` | `APP_API_HOST` | production |
| `API_HOST_STAGING` | `APP_API_HOST` | staging |

Honoured by `app-android-build.yaml` and `app-android-publish.yaml`.

## Checking Workflow Status
```bash
gh workflow list
gh run list --workflow=app-android-build.yaml
gh run view <run-id>
```
