import 'package:flutter/material.dart';
import '../../core/theme.dart';

class SyncSettingsScreen extends StatefulWidget {
  const SyncSettingsScreen({super.key});

  @override
  State<SyncSettingsScreen> createState() => _SyncSettingsScreenState();
}

class _SyncSettingsScreenState extends State<SyncSettingsScreen> {
  String _syncDirection = 'two_way';
  String _syncFrequency = 'real_time';
  String _conflictResolution = 'user_choice';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sync Settings', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Configure Synchronization',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            _buildSectionHeader('Sync Direction'),
            _buildChoiceCard('Two-way sync (Planova & Calendar)', 'two_way', _syncDirection, () => setState(() => _syncDirection = 'two_way')),
            _buildChoiceCard('One-way sync (Planova to Calendar)', 'one_way', _syncDirection, () => setState(() => _syncDirection = 'one_way')),
            const SizedBox(height: 24),
            _buildSectionHeader('Sync Frequency'),
            _buildChoiceCard('Real-time sync', 'real_time', _syncFrequency, () => setState(() => _syncFrequency = 'real_time')),
            _buildChoiceCard('Every 15 minutes', '15_min', _syncFrequency, () => setState(() => _syncFrequency = '15_min')),
            _buildChoiceCard('Daily', 'daily', _syncFrequency, () => setState(() => _syncFrequency = 'daily')),
            const SizedBox(height: 24),
            _buildSectionHeader('Conflict Resolution'),
            _buildChoiceCard('Ask user (User choice)', 'user_choice', _conflictResolution, () => setState(() => _conflictResolution = 'user_choice')),
            _buildChoiceCard('Planova timetable wins', 'planova_wins', _conflictResolution, () => setState(() => _conflictResolution = 'planova_wins')),
            _buildChoiceCard('External calendar wins', 'external_wins', _conflictResolution, () => setState(() => _conflictResolution = 'external_wins')),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Sync Settings Saved')),
                );
              },
              child: const Text('Save Settings'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
      ),
    );
  }

  Widget _buildChoiceCard(String title, String value, String currentValue, VoidCallback onTap) {
    final isSelected = value == currentValue;
    return Card(
      color: isSelected ? PlanovaTheme.primary : PlanovaTheme.surface,
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const Spacer(),
              if (isSelected) const Icon(Icons.check_circle, color: Colors.white, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
