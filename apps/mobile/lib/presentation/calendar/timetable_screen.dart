import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class TimetableScreen extends StatelessWidget {
  const TimetableScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> mockBlocks = [
      {'title': 'Protected Sleep', 'type': 'sleep', 'time': '10:00 PM - 07:00 AM'},
      {'title': 'Morning Coding', 'type': 'routine', 'time': '08:00 AM - 08:45 AM'},
      {'title': 'Work Hours', 'type': 'routine', 'time': '09:00 AM - 05:00 PM'},
      {'title': 'Study Math Exam', 'type': 'task', 'time': '06:00 PM - 08:00 PM'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Timetable', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart),
            onPressed: () => context.push('/optimization-log'),
          ),
          IconButton(
            icon: const Icon(Icons.warning_amber),
            onPressed: () => context.push('/conflicts'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Your Optimized Day',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Generated via Constraint Satisfaction backtracking.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockBlocks.length,
                itemBuilder: (context, idx) {
                  final block = mockBlocks[idx];
                  final title = block['title'] as String;
                  final type = block['type'] as String;
                  final time = block['time'] as String;

                  Color accentColor;
                  switch (type) {
                    case 'sleep':
                      accentColor = Colors.purpleAccent;
                      break;
                    case 'routine':
                      accentColor = PlanovaTheme.primary;
                      break;
                    default:
                      accentColor = PlanovaTheme.secondary;
                  }

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: accentColor, width: 1.5),
                    ),
                    child: ListTile(
                      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(time),
                      leading: Icon(
                        type == 'sleep'
                            ? Icons.bedtime
                            : type == 'routine'
                                ? Icons.loop
                                : Icons.task_alt,
                        color: accentColor,
                      ),
                    ),
                  );
                },
              ),
            ),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('AI Timetable Regenerated (24ms)')),
                );
              },
              child: const Text('Trigger AI Optimization'),
            ),
          ],
        ),
      ),
    );
  }
}
