/// Configuration for the backend API.
///
/// ## Build-time configuration
///
/// Every setting is a `--dart-define`, kept per environment in a committed
/// `config/<env>.json` file. Env names match the backend's Laravel env files:
/// `local` (`.env`), `dev` (`.env.dev`), `prod` (`.env.prod`).
///
///     flutter run --flavor local --dart-define-from-file=config/local.json
///     flutter build apk --release --flavor prod \
///         --dart-define-from-file=config/prod.json
///
/// There are no compiled-in backend defaults: `main()` calls
/// [ApiConfig.ensureConfigured] and the app refuses to start (in every build
/// mode) when a required define is missing or invalid. The files hold public
/// values only (hosts, public client ids) because everything ships in the
/// binary; never put a secret in them.
///
/// The Android flavor name matches the env name (`local`, `dev`, `prod`); see
/// `android/app/build.gradle.kts`.
enum AppEnvironment {
  local,
  dev,
  prod;

  /// Strict parse: anything other than `local`, `dev` or `prod` is a
  /// configuration error, never silently treated as production.
  static AppEnvironment fromString(String raw) {
    for (final env in AppEnvironment.values) {
      if (env.name == raw) return env;
    }
    throw FormatException(
      'Unknown APP_ENV "$raw" (expected local, dev or prod)',
    );
  }
}

class ApiConfig {
  const ApiConfig._();

  static const String _envRaw = String.fromEnvironment('APP_ENV');
  static const String _hostRaw = String.fromEnvironment('APP_API_HOST');

  /// The required defines this build was compiled without.
  static List<String> missingDefines() => [
        if (const String.fromEnvironment('APP_ENV').isEmpty) 'APP_ENV',
        if (const String.fromEnvironment('APP_API_HOST').isEmpty)
          'APP_API_HOST',
      ];

  /// Fail at startup, in every build mode, when a required define is missing
  /// or `APP_ENV` is not a known environment. (A real check, not an `assert`,
  /// because asserts are stripped from release builds.)
  static void ensureConfigured() {
    final missing = missingDefines();
    if (missing.isNotEmpty) {
      throw StateError(
        'Missing ${missing.join(', ')}. Build with '
        '--dart-define-from-file=config/<env>.json '
        '(config/prod.json, config/dev.json or config/local.json).',
      );
    }
    try {
      AppEnvironment.fromString(_envRaw);
    } on FormatException catch (e) {
      throw StateError(
        '${e.message}. Build with --dart-define-from-file=config/<env>.json.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Environment
  // ---------------------------------------------------------------------------

  static AppEnvironment get environment => AppEnvironment.fromString(_envRaw);

  static bool get isLocal => environment == AppEnvironment.local;
  static bool get isDev => environment == AppEnvironment.dev;
  static bool get isProd => environment == AppEnvironment.prod;

  /// Origin only, no path. From `APP_API_HOST` in `config/<env>.json`.
  static String get host => _hostRaw;

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
