import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class ProposalsListScreen extends StatefulWidget {
  const ProposalsListScreen({super.key});

  @override
  State<ProposalsListScreen> createState() => _ProposalsListScreenState();
}

class _ProposalsListScreenState extends State<ProposalsListScreen> {
  final List<Map<String, dynamic>> _proposals = [
    {
      'id': 'prop-1',
      'title': 'Proposal: Monday Study Group',
      'time': 'Monday 04:00 PM (90 mins)',
      'status': 'PENDING',
      'approvals': 2,
      'rejections': 0,
    },
    {
      'id': 'prop-2',
      'title': 'Proposal: Wednesday Exam Prep',
      'time': 'Wednesday 10:00 AM (120 mins)',
      'status': 'APPROVED',
      'approvals': 3,
      'rejections': 0,
    }
  ];

  void _vote(String id, bool approve) {
    setState(() {
      final idx = _proposals.indexWhere((p) => p['id'] == id);
      if (idx != -1) {
        if (approve) {
          _proposals[idx]['approvals'] = (_proposals[idx]['approvals'] as int) + 1;
        } else {
          _proposals[idx]['rejections'] = (_proposals[idx]['rejections'] as int) + 1;
        }
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Vote recorded: ${approve ? "Approved" : "Rejected"}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Proposals', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Proposed Schedule Slots',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text(
              'Vote or review time slot coordination.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: _proposals.length,
                itemBuilder: (context, idx) {
                  final prop = _proposals[idx];
                  final id = prop['id'] as String;
                  final title = prop['title'] as String;
                  final time = prop['time'] as String;
                  final status = prop['status'] as String;
                  final approvals = prop['approvals'] as int;
                  final rejections = prop['rejections'] as int;

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              Text(
                                status,
                                style: TextStyle(
                                  color: status == 'APPROVED' ? Colors.greenAccent : Colors.amberAccent,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(time, style: const TextStyle(color: PlanovaTheme.textSecondary)),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Approvals: $approvals | Rejections: $rejections', style: const TextStyle(fontSize: 12)),
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.check_circle, color: Colors.green),
                                    onPressed: status == 'PENDING' ? () => _vote(id, true) : null,
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.cancel, color: Colors.red),
                                    onPressed: status == 'PENDING' ? () => _vote(id, false) : null,
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.analytics, color: PlanovaTheme.secondary),
                                    onPressed: () => context.push('/vote-details?id=$id&title=$title&approvals=$approvals&rejections=$rejections&status=$status'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
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
