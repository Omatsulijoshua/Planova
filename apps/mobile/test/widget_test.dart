import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/main.dart';
import 'package:mobile/presentation/alarm/alarm_service.dart';
import 'package:mobile/presentation/alarm/active_alarm_screen.dart';

void main() {
  testWidgets('App starts and shows splash screen test', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: PlanovaApp()));
    expect(find.text('Planova'), findsOneWidget);
    expect(find.text('Plan Smarter. Live Better.'), findsOneWidget);
    await tester.pump(const Duration(seconds: 3));
  });

  group('AlarmService Constraint Validations', () {
    test('validateMaxCount restricts list above 15 alarms', () {
      final alarms = List.generate(
        15,
        (i) => AlarmItem(id: i.toString(), time: DateTime.now(), type: AlarmType.standard),
      );
      expect(AlarmService.validateMaxCount(alarms), false);
      expect(AlarmService.validateMaxCount([]), true);
    });

    test('validateSpacing restricts alarms scheduled under 10 minutes apart', () {
      final now = DateTime.now();
      final alarms = [
        AlarmItem(id: '1', time: now, type: AlarmType.standard),
      ];

      final conflictTime = now.add(const Duration(minutes: 5));
      final validTime = now.add(const Duration(minutes: 15));

      expect(AlarmService.validateSpacing(conflictTime, alarms), false);
      expect(AlarmService.validateSpacing(validTime, alarms), true);
    });

    test('validateDuration restricts durations under 1 minute', () {
      expect(AlarmService.validateDuration(const Duration(seconds: 30)), false);
      expect(AlarmService.validateDuration(const Duration(minutes: 2)), true);
    });
  });

  group('Captcha Alarm Screen Interactive Test', () {
    testWidgets('dismiss button is disabled until correct captcha is entered', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: ActiveAlarmScreen(alarmType: AlarmType.captcha),
        ),
      );

      // Verify captcha equation text is shown
      expect(find.text('7 + 8 = ?'), findsOneWidget);

      // Check that dismiss button starts disabled
      final buttonFinder = find.byKey(const Key('dismiss_button'));
      var button = tester.widget<ElevatedButton>(buttonFinder);
      expect(button.enabled, false);

      // Enter wrong code
      await tester.enterText(find.byKey(const Key('captcha_field')), '14');
      await tester.pump();
      button = tester.widget<ElevatedButton>(buttonFinder);
      expect(button.enabled, false);

      // Enter correct code
      await tester.enterText(find.byKey(const Key('captcha_field')), '15');
      await tester.pump();
      button = tester.widget<ElevatedButton>(buttonFinder);
      expect(button.enabled, true);
    });
  });
}
