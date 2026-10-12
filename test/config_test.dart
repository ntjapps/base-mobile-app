import 'dart:convert';
import 'dart:io';

import 'package:base_mobile_app/config/api_config.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('there are no defaults: a build without the defines refuses to start', () {
    // `flutter test` passes no dart-defines.
    expect(ApiConfig.missingDefines(), ['APP_ENV', 'APP_API_HOST']);
    expect(
      ApiConfig.ensureConfigured,
      throwsA(
        isA<StateError>().having(
          (e) => e.message,
          'message',
          contains('config/<env>.json'),
        ),
      ),
    );
  });

  test('APP_API_VERSION defaults to v1', () {
    expect(ApiConfig.apiVersion, 'v1');
  });

  group('AppEnvironment.fromString', () {
    test('accepts exactly local, dev and prod', () {
      expect(AppEnvironment.fromString('local'), AppEnvironment.local);
      expect(AppEnvironment.fromString('dev'), AppEnvironment.dev);
      expect(AppEnvironment.fromString('prod'), AppEnvironment.prod);
    });

    test('rejects unknown values instead of falling back to prod', () {
      for (final raw in ['', 'production', 'staging', 'Prod', 'qa']) {
        expect(
          () => AppEnvironment.fromString(raw),
          throwsFormatException,
          reason: raw,
        );
      }
    });
  });

  for (final env in AppEnvironment.values.map((e) => e.name)) {
    test('config/$env.json sets every required define', () {
      final defines =
          jsonDecode(File('config/$env.json').readAsStringSync())
              as Map<String, dynamic>;
      expect(defines['APP_ENV'], env);
      expect(AppEnvironment.fromString(defines['APP_ENV'] as String).name, env);
      final host = Uri.parse(defines['APP_API_HOST'] as String);
      expect(host.scheme, 'https');
      expect(host.host, isNotEmpty);
      expect(host.path, anyOf(isEmpty, '/'), reason: 'origin only, no path');
      if (env == 'prod') {
        expect(defines.containsKey('APP_ALLOW_BAD_CERT'), isFalse);
      }
    });
  }
}
