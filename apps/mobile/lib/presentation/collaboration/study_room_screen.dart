import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class StudyRoomScreen extends StatefulWidget {
  const StudyRoomScreen({super.key});

  @override
  State<StudyRoomScreen> createState() => _StudyRoomScreenState();
}

class _StudyRoomScreenState extends State<StudyRoomScreen> {
  final List<String> _activities = [
    'User A joined the study room.',
    'User B joined the study room.',
  ];

  void _shareLocation() {
    setState(() {
      _activities.add('You shared location: Lat 37.77, Lng -122.41');
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Location shared with room members')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Group Room', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.list_alt),
            onPressed: () => context.push('/proposals'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Real-Time Workspace',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Coordinate study session slots and share locations with your group.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _shareLocation,
              icon: const Icon(Icons.my_location),
              label: const Text('Share My Coordinates'),
              style: ElevatedButton.styleFrom(backgroundColor: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 24),
            const Text(
              'Activity Log',
              style: TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: PlanovaTheme.surface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ListView.builder(
                  itemCount: _activities.length,
                  itemBuilder: (context, idx) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline, size: 16, color: PlanovaTheme.primary),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _activities[idx],
                              style: const TextStyle(fontSize: 13),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.push('/proposals'),
              child: const Text('View Scheduling Proposals'),
            ),
          ],
        ),
      ),
    );
  }
}
