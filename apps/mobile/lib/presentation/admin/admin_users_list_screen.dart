import 'package:flutter/material.dart';
import '../../core/theme.dart';

class AdminUsersListScreen extends StatelessWidget {
  const AdminUsersListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> mockUsers = [
      {'email': 'admin@planova.com', 'role': 'SYSTEM_ADMIN'},
      {'email': 'john.doe@student.com', 'role': 'STUDENT'},
      {'email': 'jane.smith@student.com', 'role': 'STUDENT'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Registered Users', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Active Users (${mockUsers.length})',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockUsers.length,
                itemBuilder: (context, idx) {
                  final user = mockUsers[idx];
                  final email = user['email'] as String;
                  final role = user['role'] as String;

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text(email, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('Role: $role'),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: role == 'SYSTEM_ADMIN' ? Colors.red.withAlpha(50) : Colors.blue.withAlpha(50),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          role == 'SYSTEM_ADMIN' ? 'ADMIN' : 'STUDENT',
                          style: TextStyle(
                            color: role == 'SYSTEM_ADMIN' ? Colors.redAccent : Colors.blueAccent,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
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
    );
  }
}
