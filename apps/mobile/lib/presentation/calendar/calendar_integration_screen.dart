import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class CalendarIntegrationScreen extends StatefulWidget {
  const CalendarIntegrationScreen({super.key});

  @override
  State<CalendarIntegrationScreen> createState() => _CalendarIntegrationScreenState();
}

class _CalendarIntegrationScreenState extends State<CalendarIntegrationScreen> {
  bool _googleConnected = false;
  bool _appleConnected = false;
  bool _outlookConnected = false;

  void _toggleConnect(String provider, bool value) {
    setState(() {
      if (provider == 'google') _googleConnected = value;
      if (provider == 'apple') _appleConnected = value;
      if (provider == 'outlook') _outlookConnected = value;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${provider.toUpperCase()} Calendar ${value ? "Connected" : "Disconnected"} (Mocked)')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendar Integrations', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => context.push('/sync-settings'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Connect External Calendars',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 12),
            const Text(
              'Link your work or personal calendars to enable two-way sync with Planova AI.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 32),
            _buildProviderCard(
              name: 'Google Calendar',
              isConnected: _googleConnected,
              icon: Icons.calendar_today,
              color: Colors.redAccent,
              onChanged: (val) => _toggleConnect('google', val),
            ),
            const SizedBox(height: 16),
            _buildProviderCard(
              name: 'Apple Calendar',
              isConnected: _appleConnected,
              icon: Icons.apple,
              color: Colors.white,
              onChanged: (val) => _toggleConnect('apple', val),
            ),
            const SizedBox(height: 16),
            _buildProviderCard(
              name: 'Outlook Calendar',
              isConnected: _outlookConnected,
              icon: Icons.work_outline,
              color: Colors.blueAccent,
              onChanged: (val) => _toggleConnect('outlook', val),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () => context.push('/sync-history'),
              style: ElevatedButton.styleFrom(backgroundColor: PlanovaTheme.secondary),
              child: const Text('View Sync History'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProviderCard({
    required String name,
    required bool isConnected,
    required IconData icon,
    required Color color,
    required ValueChanged<bool> onChanged,
  }) {
    return Card(
      color: PlanovaTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Icon(icon, color: color, size: 36),
            const SizedBox(width: 16),
            Text(
              name,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            Switch(
              value: isConnected,
              onChanged: onChanged,
            ),
          ],
        ),
      ),
    );
  }
}
