enum AlarmType { standard, persistent, progressive, captcha }

class AlarmItem {
  final String id;
  final DateTime time;
  final AlarmType type;
  final bool isEnabled;

  AlarmItem({
    required this.id,
    required this.time,
    required this.type,
    this.isEnabled = true,
  });
}

class AlarmService {
  static const int maxAlarmsPerDay = 15;
  static const Duration minSpacing = Duration(minutes: 10);
  static const Duration minDuration = Duration(minutes: 1);

  static bool validateMaxCount(List<AlarmItem> currentAlarms) {
    return currentAlarms.length < maxAlarmsPerDay;
  }

  static bool validateSpacing(DateTime newTime, List<AlarmItem> currentAlarms) {
    for (final alarm in currentAlarms) {
      if (alarm.time.year == newTime.year &&
          alarm.time.month == newTime.month &&
          alarm.time.day == newTime.day) {
        final diff = alarm.time.difference(newTime).abs();
        if (diff < minSpacing) {
          return false;
        }
      }
    }
    return true;
  }

  static bool validateDuration(Duration duration) {
    return duration >= minDuration;
  }
}
