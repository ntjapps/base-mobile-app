/// Configuration for the backend API.
///
/// ## Build-time configuration
///
/// Pick the whole environment with one switch:
///
///     flutter run --dart-define=APP_ENV=staging
///     flutter build apk --release --dart-define=APP_ENV=production
///
/// Or override the host directly (wins over the env preset):
///
///     --dart-define=APP_API_HOST=https://staging.example.com
///
/// The Android Gradle config (`android/app/build.gradle.kts`) wires
/// `productionDebug/Release` and `stagingDebug/Release` flavors. Always pair
/// `--flavor <env>` with `--dart-define=APP_ENV=<env>` in all build commands.
enum AppEnvironment {
  production,
  staging;

  static AppEnvironment fromString(String raw) {
    switch (raw.toLowerCase()) {
      case 'staging':
      case 'stage':
      case 'dev':
      case 'development':
        return AppEnvironment.staging;
      case 'production':
      case 'prod':
      default:
        return AppEnvironment.production;
    }
  }
}

class _EnvPreset {
  const _EnvPreset({required this.host});

  final String host;
}

class ApiConfig {
  const ApiConfig._();

  // ---------------------------------------------------------------------------
  // Environment switch
  // ---------------------------------------------------------------------------

  static const String _envRaw = String.fromEnvironment(
    'APP_ENV',
    defaultValue: 'production',
  );

  static AppEnvironment get environment => AppEnvironment.fromString(_envRaw);

  static bool get isProduction => environment == AppEnvironment.production;
  static bool get isStaging => environment == AppEnvironment.staging;

  /// Per-environment defaults. Keep in sync with your backend deploys.
  /// Individual `--dart-define=APP_API_HOST=...` overrides take precedence.
  static const Map<AppEnvironment, _EnvPreset> _presets = {
    AppEnvironment.production: _EnvPreset(
      host: 'https://api.example.com',
    ),
    AppEnvironment.staging: _EnvPreset(
      host: 'https://staging-api.example.com',
    ),
  };

  static _EnvPreset get _preset => _presets[environment]!;

  // ---------------------------------------------------------------------------
  // Per-key override — optional. Empty string means "fall back to preset".
  // ---------------------------------------------------------------------------

  static const String _hostOverride = String.fromEnvironment('APP_API_HOST');

  /// Origin only — no path. Defaults to the env preset; override with
  /// `--dart-define=APP_API_HOST=...`.
  static String get host =>
      _hostOverride.isNotEmpty ? _hostOverride : _preset.host;

  /// API version segment. Bump when the backend ships a new major version.
  static const String apiVersion = String.fromEnvironment(
    'APP_API_VERSION',
    defaultValue: 'v1',
  );

  /// Versioned API root, e.g. `https://api.example.com/api/v1`.
  static String get baseUrl => '$host/api/$apiVersion';

  // ---------------------------------------------------------------------------
  // HTTP timing
  // ---------------------------------------------------------------------------

  static const Duration httpTimeout = Duration(seconds: 20);

  // ---------------------------------------------------------------------------
  // Diagnostics
  // ---------------------------------------------------------------------------

  /// Human-readable summary suitable for a debug banner / about screen.
  static String describe() => '''
App — ${environment.name}
  host:    $host
  api:     $baseUrl''';
}
