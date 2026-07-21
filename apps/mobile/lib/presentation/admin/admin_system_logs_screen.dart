import 'package:flutter/material.dart';
import '../../core/theme.dart';

class AdminSystemLogsScreen extends StatefulWidget {
  const AdminSystemLogsScreen({super.key});

  @override
  State<AdminSystemLogsScreen> createState() => _AdminSystemLogsScreenState();
}

class _AdminSystemLogsScreenState extends State<AdminSystemLogsScreen> {
  final _filterController = TextEditingController();
  final List<Map<String, String>> _allLogs = [
    {'action': 'auth:login', 'user': 'john.doe@student.com', 'time': '16:45:12'},
    {'action': 'timetable:optimize', 'user': 'jane.smith@student.com', 'time': '16:44:54'},
    {'action': 'preferences:update', 'user': 'john.doe@student.com', 'time': '16:40:02'},
  ];
  List<Map<String, String>> _filteredLogs = [];

  @override
  void initState() {
    super.initState();
    _filteredLogs = _allLogs;
  }

  void _filterLogs(String filter) {
    setState(() {
      _filteredLogs = _allLogs.where((log) {
        final action = log['action'] as String;
        final user = log['user'] as String;
        return action.contains(filter.toLowerCase()) || user.contains(filter.toLowerCase());
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('System Audit Logs', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _filterController,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.search),
                labelText: 'Filter logs',
                hintText: 'e.g., auth, student email',
              ),
              onChanged: _filterLogs,
            ),
            const SizedBox(height: 24),
            Text(
              'Audit Logs Output (${_filteredLogs.length})',
              style: const TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.black38,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: PlanovaTheme.surface),
                ),
                child: ListView.builder(
                  itemCount: _filteredLogs.length,
                  itemBuilder: (context, idx) {
                    final log = _filteredLogs[idx];
                    final action = log['action'] as String;
                    final user = log['user'] as String;
                    final time = log['time'] as String;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Text(
                        '[$time] User: $user - Action: $action',
                        style: const TextStyle(fontFamily: 'Courier', fontSize: 12, color: Colors.greenAccent),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
