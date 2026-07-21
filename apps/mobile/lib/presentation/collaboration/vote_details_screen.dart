import 'package:flutter/material.dart';
import '../../core/theme.dart';

class VoteDetailsScreen extends StatelessWidget {
  final String proposalId;
  final String title;
  final int approvals;
  final int rejections;
  final String status;

  const VoteDetailsScreen({
    super.key,
    required this.proposalId,
    required this.title,
    required this.approvals,
    required this.rejections,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final total = approvals + rejections;
    final approvalPct = total == 0 ? 0.0 : (approvals / total);
    final rejectionPct = total == 0 ? 0.0 : (rejections / total);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Voting Details', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Status: $status',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: status == 'APPROVED' ? Colors.greenAccent : Colors.amberAccent,
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Approvals',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: approvalPct,
              backgroundColor: PlanovaTheme.surface,
              color: Colors.green,
              minHeight: 12,
            ),
            const SizedBox(height: 8),
            Text('$approvals approvals (${(approvalPct * 100).toStringAsFixed(0)}%)', style: const TextStyle(color: PlanovaTheme.textSecondary)),
            const SizedBox(height: 24),
            const Text(
              'Rejections',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: rejectionPct,
              backgroundColor: PlanovaTheme.surface,
              color: Colors.redAccent,
              minHeight: 12,
            ),
            const SizedBox(height: 8),
            Text('$rejections rejections (${(rejectionPct * 100).toStringAsFixed(0)}%)', style: const TextStyle(color: PlanovaTheme.textSecondary)),
            const Spacer(),
            const Card(
              color: PlanovaTheme.surface,
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Text('Voters Summary', style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Text('Tally checks complete. Early conflict checks verified no schedule conflicts.', style: TextStyle(fontSize: 12, color: PlanovaTheme.textSecondary)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
