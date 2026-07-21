import 'package:flutter/material.dart';
import '../../core/theme.dart';

class OptimizationLogScreen extends StatelessWidget {
  const OptimizationLogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> mockLogs = [
      'Initializing CSP solver...',
      'Sleep period configured: 22:00 to 07:00',
      'Protected sleep period: blocked 36 slots',
      'Allocating routine "Work Hour" starting at slot 36 (4 slots)',
      'MRV: Selecting task "Study Math" (valid slots count: 18)',
      'Forward Checking: verifying future task paths...',
      'Backtracking search completed successfully',
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Optimization Diagnostics', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Solver Output Logs',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: PlanovaTheme.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('EXECUTION SPEED', style: TextStyle(fontSize: 12, color: PlanovaTheme.textSecondary)),
                      SizedBox(height: 4),
                      Text('24 ms', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: PlanovaTheme.secondary)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('SLOTS EVALUATED', style: TextStyle(fontSize: 12, color: PlanovaTheme.textSecondary)),
                      SizedBox(height: 4),
                      Text('96 slots', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: PlanovaTheme.primary)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Backtracking Operations',
              style: TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black38,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: PlanovaTheme.surface),
                ),
                child: ListView.builder(
                  itemCount: mockLogs.length,
                  itemBuilder: (context, idx) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Text(
                        mockLogs[idx],
                        style: const TextStyle(fontFamily: 'Courier', fontSize: 13, color: Colors.greenAccent),
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
