import 'package:flutter/material.dart';
import '../../core/theme.dart';

class ConflictViewerScreen extends StatelessWidget {
  const ConflictViewerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> mockConflicts = [
      {
        'title': 'Overlapping Window Alert',
        'details': 'Task "Study Math" starts during your configured Sleep window.',
        'severity': 'MEDIUM'
      },
      {
        'title': 'Meal Buffer Violation',
        'details': 'Routine "Coding Block" overlaps the 30-minute lunch travel buffer.',
        'severity': 'LOW'
      }
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Conflict Analytics', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Schedule Conflicts',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Any soft constraint overlaps detected during planning.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockConflicts.length,
                itemBuilder: (context, idx) {
                  final conflict = mockConflicts[idx];
                  final title = conflict['title'] as String;
                  final details = conflict['details'] as String;
                  final severity = conflict['severity'] as String;

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: severity == 'HIGH'
                                      ? Colors.red.withAlpha(50)
                                      : Colors.amber.withAlpha(50),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  severity,
                                  style: TextStyle(
                                    color: severity == 'HIGH' ? Colors.redAccent : Colors.amberAccent,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(details, style: const TextStyle(color: PlanovaTheme.textSecondary)),
                        ],
                      ),
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
