# Android Build & Publish Skills

## Flavors

Flavor name == env name == `config/<flavor>.json`:

| Flavor | applicationId | versionNameSuffix |
|---|---|---|
| `prod` | `com.ntj125app.base_mobile` | _(none)_ |
| `dev` | `com.ntj125app.base_mobile.staging` (id kept from the former `staging` flavor for already-installed builds) | `-staging` |
| `local` | `com.ntj125app.base_mobile.local` | `-local` |

Always pair `--flavor <env>` with `--dart-define-from-file=config/<env>.json`; the app refuses to start without the defines. The tag publish builds `prod` and `dev`.

## Local Debug Build
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

## Local Release Build (requires keystore)
```bash
flutter build apk --release --flavor prod --dart-define-from-file=config/prod.json
flutter build apk --release --flavor dev  --dart-define-from-file=config/dev.json
flutter build appbundle --release --flavor prod --dart-define-from-file=config/prod.json
flutter build appbundle --release --flavor dev  --dart-define-from-file=config/dev.json
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
- Manual dispatch only (`workflow_dispatch` from the Actions tab)
- Workflow: `.github/workflows/app-android-build.yaml`
- Takes a `config` input (`prod` default, or `dev`): used as the flavor and as `config/<config>.json`

### Release bundle (manual Play Console upload)
- Create and push a version tag: `git tag v1.2.3 && git push origin v1.2.3`
- Workflow: `.github/workflows/app-android-publish.yaml`
- Builds signed AABs for `prod` and `dev` (`build-prod` and `build-dev` jobs) as run artifacts; upload them by hand in the Play Console web UI (there is no service-account publish)
- No version-bump PR is opened; the build number comes from CI, not pubspec

## Skip-on-missing-secret behavior
- If `KEYSTORE_BASE64` is absent, the build steps are skipped (job still runs, reports a notice).
- Missing secrets never cause the workflow to fail — they are silently skipped with a `::notice::` log line.

## Version Management
Version is in `pubspec.yaml`:
```yaml
version: 0.0.3   # semver only — no +buildNumber suffix
```
- `pubspec.yaml` holds only the semver (`major.minor.patch`); no `+buildNumber` suffix.
- CI injects the Play Store build number via `--build-number=$BUILD_NUMBER`, where `BUILD_NUMBER` equals `github.run_number` (no offset for this repo).
- Monotonically increasing build numbers are guaranteed by the ever-incrementing `github.run_number`.

## Required GitHub Secrets
| Secret | Description | Required |
|---|---|---|
| `KEYSTORE_BASE64` | Base64-encoded JKS keystore file | Recommended |
| `KEY_ALIAS` | Keystore key alias | Recommended |
| `KEY_PASSWORD` | Key password | Recommended |
| `KEYSTORE_PASSWORD` | Keystore password | Recommended |

## Checking Workflow Status
```bash
gh workflow list
gh run list --workflow=app-android-build.yaml
gh run view <run-id>
```
