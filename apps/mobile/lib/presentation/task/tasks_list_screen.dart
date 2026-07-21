import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class TasksListScreen extends StatelessWidget {
  const TasksListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> mockTasks = [
      {'title': 'Math Exam Study', 'category': 'Study', 'duration': 120, 'priority': 'HIGH', 'status': 'Pending'},
      {'title': 'Compile NestJS Auth', 'category': 'Work', 'duration': 60, 'priority': 'HIGH', 'status': 'In Progress'},
      {'title': 'Clean Room', 'category': 'Personal', 'duration': 40, 'priority': 'LOW', 'status': 'Completed'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tasks', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/add-task'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Your Action Tasks',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Dynamic due items that can be rearranged by the AI planner.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockTasks.length,
                itemBuilder: (context, idx) {
                  final task = mockTasks[idx];
                  final title = task['title'] as String;
                  final category = task['category'] as String;
                  final duration = task['duration'] as int;
                  final priority = task['priority'] as String;
                  final status = task['status'] as String;

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      title: Text(title),
                      subtitle: Text('$category | $duration mins'),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            priority,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            status,
                            style: TextStyle(
                              fontSize: 12,
                              color: status == 'Completed'
                                  ? Colors.greenAccent
                                  : status == 'In Progress'
                                      ? Colors.blueAccent
                                      : Colors.amberAccent,
                            ),
                          ),
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
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/add-task'),
        backgroundColor: PlanovaTheme.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
