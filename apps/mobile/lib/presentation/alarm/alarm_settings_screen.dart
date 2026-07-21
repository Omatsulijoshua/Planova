import 'package:flutter/material.dart';
import '../../core/theme.dart';
import 'alarm_service.dart';

class AlarmSettingsScreen extends StatefulWidget {
  const AlarmSettingsScreen({super.key});

  @override
  State<AlarmSettingsScreen> createState() => _AlarmSettingsScreenState();
}

class _AlarmSettingsScreenState extends State<AlarmSettingsScreen> {
  final List<AlarmItem> _alarms = [];
  AlarmType _selectedType = AlarmType.standard;
  int _selectedHour = 8;
  int _selectedMinute = 0;

  void _addAlarm() {
    final now = DateTime.now();
    final newAlarmTime = DateTime(now.year, now.month, now.day, _selectedHour, _selectedMinute);

    if (!AlarmService.validateMaxCount(_alarms)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error: Maximum limit of 15 daily alarms reached!')),
      );
      return;
    }

    if (!AlarmService.validateSpacing(newAlarmTime, _alarms)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error: Alarms must be spaced at least 10 minutes apart!')),
      );
      return;
    }

    setState(() {
      _alarms.add(
        AlarmItem(
          id: DateTime.now().toString(),
          time: newAlarmTime,
          type: _selectedType,
        ),
      );
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Success: ${_selectedType.name.toUpperCase()} alarm scheduled!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Alarm Configuration', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Add New Alarm',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                DropdownButton<int>(
                  value: _selectedHour,
                  items: List.generate(24, (i) => DropdownMenuItem(value: i, child: Text(i.toString().padLeft(2, '0')))),
                  onChanged: (val) => setState(() => _selectedHour = val!),
                ),
                const Text(' : ', style: TextStyle(fontSize: 20)),
                DropdownButton<int>(
                  value: _selectedMinute,
                  items: List.generate(60, (i) => DropdownMenuItem(value: i, child: Text(i.toString().padLeft(2, '0')))),
                  onChanged: (val) => setState(() => _selectedMinute = val!),
                ),
              ],
            ),
            const SizedBox(height: 24),
            DropdownButtonFormField<AlarmType>(
              initialValue: _selectedType,
              decoration: const InputDecoration(labelText: 'Alarm Ring Style'),
              items: AlarmType.values.map((type) {
                return DropdownMenuItem(value: type, child: Text(type.name.toUpperCase()));
              }).toList(),
              onChanged: (val) => setState(() => _selectedType = val!),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _addAlarm,
              child: const Text('Save Alarm Settings'),
            ),
            const SizedBox(height: 24),
            const Text(
              'Scheduled Alarms',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _alarms.length,
                itemBuilder: (context, idx) {
                  final alarm = _alarms[idx];
                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text('${alarm.time.hour.toString().padLeft(2, '0')}:${alarm.time.minute.toString().padLeft(2, '0')}'),
                      subtitle: Text('Type: ${alarm.type.name.toUpperCase()}'),
                      trailing: const Icon(Icons.alarm, color: PlanovaTheme.primary),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
