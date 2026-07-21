import 'package:flutter/material.dart';
import '../../core/theme.dart';

class WidgetConfigScreen extends StatefulWidget {
  const WidgetConfigScreen({super.key});

  @override
  State<WidgetConfigScreen> createState() => _WidgetConfigScreenState();
}

class _WidgetConfigScreenState extends State<WidgetConfigScreen> {
  String _widgetSize = 'medium';
  bool _showProtectedPeriods = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Widget Settings', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Home Screen Widget',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            const Text(
              'Widget Preview',
              style: TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            Container(
              height: 150,
              decoration: BoxDecoration(
                color: PlanovaTheme.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: PlanovaTheme.primary, width: 2),
              ),
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('08:00 AM - Morning Focus', style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Text('Planova AI Timetable Widget', style: TextStyle(fontSize: 12, color: PlanovaTheme.textSecondary)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            DropdownButtonFormField<String>(
              initialValue: _widgetSize,
              decoration: const InputDecoration(labelText: 'Widget Layout Size'),
              items: const [
                DropdownMenuItem(value: 'small', child: Text('SMALL (2x2)')),
                DropdownMenuItem(value: 'medium', child: Text('MEDIUM (4x2)')),
                DropdownMenuItem(value: 'large', child: Text('LARGE (4x4)')),
              ],
              onChanged: (val) => setState(() => _widgetSize = val!),
            ),
            const SizedBox(height: 24),
            SwitchListTile(
              title: const Text('Show Protected Periods'),
              value: _showProtectedPeriods,
              onChanged: (val) => setState(() => _showProtectedPeriods = val),
              contentPadding: EdgeInsets.zero,
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Widget Configurations Saved')),
                );
              },
              child: const Text('Save Configurations'),
            ),
          ],
        ),
      ),
    );
  }
}
