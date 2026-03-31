# Android Build & Publish Skills

## Local Debug Build
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

## Local Release Build (requires keystore)
```bash
flutter build apk --release
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
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
- Push to any branch or open a PR
- Workflow: `.github/workflows/app-android-build.yaml`

### Publish to Play Store
- Create and push a version tag: `git tag v1.2.3 && git push origin v1.2.3`
- Workflow: `.github/workflows/app-android-publish.yaml`
- Publishes to **internal track** as a draft release
- After success, a PR is auto-opened to bump `pubspec.yaml` version

## Version Management
Version is in `pubspec.yaml`:
```yaml
version: 0.0.3+13   # semver+buildNumber
```
- The `+buildNumber` is what the Play Store uses (must be monotonically increasing)
- CI auto-increments the build number during publish

## Required GitHub Secrets
| Secret | Description |
|---|---|
| `KEYSTORE_BASE64` | Base64-encoded JKS keystore file |
| `KEY_ALIAS` | Keystore key alias |
| `KEY_PASSWORD` | Key password |
| `KEYSTORE_PASSWORD` | Keystore password |
| `PLAY_STORE_SERVICE_ACCOUNT_JSON` | GCP service account JSON for Play Store API |

## Checking Workflow Status
```bash
gh workflow list
gh run list --workflow=app-android-build.yaml
gh run view <run-id>
```
