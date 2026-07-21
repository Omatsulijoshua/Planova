import 'package:flutter/material.dart';
import '../../core/theme.dart';

class SyncHistoryScreen extends StatelessWidget {
  const SyncHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> mockLogs = [
      {'time': '10 mins ago', 'provider': 'Google Calendar', 'synced': 4, 'conflicts': 0, 'status': 'Success'},
      {'time': '1 hour ago', 'provider': 'Apple Calendar', 'synced': 2, 'conflicts': 1, 'status': 'Conflict Detected'},
      {'time': 'Yesterday', 'provider': 'Google Calendar', 'synced': 12, 'conflicts': 0, 'status': 'Success'},
      {'time': '3 days ago', 'provider': 'Outlook Calendar', 'synced': 0, 'conflicts': 0, 'status': 'Failed (Auth Expired)'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sync History', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Sync Logs',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Displays synchronization histories over the past 30 days.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockLogs.length,
                itemBuilder: (context, idx) {
                  final log = mockLogs[idx];
                  final isSuccess = log['status'] == 'Success';
                  final isConflict = log['status'] == 'Conflict Detected';

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      title: Text('${log['provider']} - ${log['status']}'),
                      subtitle: Text(
                        'Time: ${log['time']} | Synced: ${log['synced']} items | Conflicts: ${log['conflicts']}',
                        style: const TextStyle(fontSize: 12),
                      ),
                      trailing: Icon(
                        isSuccess
                            ? Icons.check_circle
                            : isConflict
                                ? Icons.warning
                                : Icons.error,
                        color: isSuccess
                            ? Colors.greenAccent
                            : isConflict
                                ? Colors.amberAccent
                                : Colors.redAccent,
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
