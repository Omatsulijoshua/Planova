import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class RoutinesListScreen extends StatelessWidget {
  const RoutinesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> mockRoutines = [
      {'title': 'Morning Coding', 'category': 'Study', 'duration': 45, 'priority': 'HIGH'},
      {'title': 'Afternoon Run', 'category': 'Exercise', 'duration': 30, 'priority': 'MEDIUM'},
      {'title': 'Evening Reading', 'category': 'Personal', 'duration': 20, 'priority': 'LOW'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Routines', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/add-routine'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Your Core Routines',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Habitual scheduling blocks to establish baseline constraints.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockRoutines.length,
                itemBuilder: (context, idx) {
                  final routine = mockRoutines[idx];
                  final title = routine['title'] as String;
                  final category = routine['category'] as String;
                  final duration = routine['duration'] as int;
                  final priority = routine['priority'] as String;

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      title: Text(title),
                      subtitle: Text('$category | $duration mins'),
                      trailing: Text(
                        priority,
                        style: TextStyle(
                          color: priority == 'HIGH'
                              ? Colors.redAccent
                              : priority == 'MEDIUM'
                                  ? Colors.amberAccent
                                  : Colors.greenAccent,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/add-routine'),
        backgroundColor: PlanovaTheme.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
