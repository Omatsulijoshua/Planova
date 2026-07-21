import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/secure_storage_service.dart';

class PreferencesState {
  final String timezone;
  final String wakeTime;
  final String sleepTime;
  final List<int> workDays;
  final List<int> schoolDays;
  final String preferredStudyTime;
  final String preferredFocusTime;
  final int breakDuration;
  final int travelPadding;
  final bool prayerTimesEnabled;
  final String controlMode;
  final int maxTaskMovementWindow;

  PreferencesState({
    required this.timezone,
    required this.wakeTime,
    required this.sleepTime,
    required this.workDays,
    required this.schoolDays,
    required this.preferredStudyTime,
    required this.preferredFocusTime,
    required this.breakDuration,
    required this.travelPadding,
    required this.prayerTimesEnabled,
    required this.controlMode,
    required this.maxTaskMovementWindow,
  });

  factory PreferencesState.defaultVal() {
    return PreferencesState(
      timezone: 'UTC',
      wakeTime: '07:00',
      sleepTime: '23:00',
      workDays: [1, 2, 3, 4, 5],
      schoolDays: [1, 2, 3, 4, 5],
      preferredStudyTime: '18:00',
      preferredFocusTime: '09:00',
      breakDuration: 15,
      travelPadding: 15,
      prayerTimesEnabled: false,
      controlMode: 'SUGGEST',
      maxTaskMovementWindow: 24,
    );
  }

  PreferencesState copyWith({
    String? timezone,
    String? wakeTime,
    String? sleepTime,
    List<int>? workDays,
    List<int>? schoolDays,
    String? preferredStudyTime,
    String? preferredFocusTime,
    int? breakDuration,
    int? travelPadding,
    bool? prayerTimesEnabled,
    String? controlMode,
    int? maxTaskMovementWindow,
  }) {
    return PreferencesState(
      timezone: timezone ?? this.timezone,
      wakeTime: wakeTime ?? this.wakeTime,
      sleepTime: sleepTime ?? this.sleepTime,
      workDays: workDays ?? this.workDays,
      schoolDays: schoolDays ?? this.schoolDays,
      preferredStudyTime: preferredStudyTime ?? this.preferredStudyTime,
      
      preferredFocusTime: preferredFocusTime ?? this.preferredFocusTime,
      breakDuration: breakDuration ?? this.breakDuration,
      travelPadding: travelPadding ?? this.travelPadding,
      prayerTimesEnabled: prayerTimesEnabled ?? this.prayerTimesEnabled,
      controlMode: controlMode ?? this.controlMode,
      maxTaskMovementWindow: maxTaskMovementWindow ?? this.maxTaskMovementWindow,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'timezone': timezone,
      'wakeTime': wakeTime,
      'sleepTime': sleepTime,
      'workDays': workDays,
      'schoolDays': schoolDays,
      'preferredStudyTime': preferredStudyTime,
      'preferredFocusTime': preferredFocusTime,
      'breakDuration': breakDuration,
      'travelPadding': travelPadding,
      'prayerTimesEnabled': prayerTimesEnabled,
      'controlMode': controlMode,
      'maxTaskMovementWindow': maxTaskMovementWindow,
    };
  }

  factory PreferencesState.fromMap(Map<String, dynamic> map) {
    return PreferencesState(
      timezone: map['timezone'] as String? ?? 'UTC',
      wakeTime: map['wakeTime'] as String? ?? '07:00',
      sleepTime: map['sleepTime'] as String? ?? '23:00',
      workDays: List<int>.from(map['workDays'] as Iterable? ?? []),
      schoolDays: List<int>.from(map['schoolDays'] as Iterable? ?? []),
      preferredStudyTime: map['preferredStudyTime'] as String? ?? '18:00',
      preferredFocusTime: map['preferredFocusTime'] as String? ?? '09:00',
      breakDuration: map['breakDuration'] as int? ?? 15,
      travelPadding: map['travelPadding'] as int? ?? 15,
      prayerTimesEnabled: map['prayerTimesEnabled'] as bool? ?? false,
      controlMode: map['controlMode'] as String? ?? 'SUGGEST',
      maxTaskMovementWindow: map['maxTaskMovementWindow'] as int? ?? 24,
    );
  }
}

class PreferencesNotifier extends Notifier<PreferencesState> {
  @override
  PreferencesState build() {
    _loadFromLocal();
    return PreferencesState.defaultVal();
  }

  Future<void> _loadFromLocal() async {
    final raw = await SecureStorageService.read('user_preferences');
    if (raw != null) {
      try {
        state = PreferencesState.fromMap(json.decode(raw) as Map<String, dynamic>);
      } catch (_) {}
    }
  }

  Future<void> updatePreferences(PreferencesState newState) async {
    state = newState;
    await SecureStorageService.write('user_preferences', json.encode(newState.toMap()));
  }
}

final preferencesProvider = NotifierProvider<PreferencesNotifier, PreferencesState>(PreferencesNotifier.new);
