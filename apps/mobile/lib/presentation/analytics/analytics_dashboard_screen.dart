import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class AnalyticsDashboardScreen extends StatelessWidget {
  const AnalyticsDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics Dashboard', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.rate_review),
            onPressed: () => context.push('/feedback'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Your Productivity Metrics',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Real-time metrics computed from your routines, tasks, and sleep habits.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            _buildMetricCard(
              title: 'Focus Score',
              value: '84 / 100',
              subtitle: 'Formulated from tasks completion & sleep',
              icon: Icons.track_changes,
              color: Colors.greenAccent,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildMiniMetricCard(
                    title: 'Completed Tasks',
                    value: '12 items',
                    icon: Icons.task_alt,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildMiniMetricCard(
                    title: 'Routine Streak',
                    value: '7 days',
                    icon: Icons.flash_on,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildMiniMetricCard(
                    title: 'Sleep Duration',
                    value: '8.2 hrs',
                    icon: Icons.bedtime,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildMiniMetricCard(
                    title: 'Conflicts Logs',
                    value: '0 issues',
                    icon: Icons.warning_amber,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => context.push('/feedback'),
              child: const Text('Submit App Feedback'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      color: PlanovaTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          children: [
            Icon(icon, size: 48, color: color),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24, color: PlanovaTheme.secondary)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: PlanovaTheme.textSecondary)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniMetricCard({
    required String title,
    required String value,
    required IconData icon,
  }) {
    return Card(
      color: PlanovaTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 28, color: PlanovaTheme.primary),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 12, color: PlanovaTheme.textSecondary)),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
      ),
    );
  }
}
