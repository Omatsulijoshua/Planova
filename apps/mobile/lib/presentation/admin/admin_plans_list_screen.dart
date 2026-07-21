import 'package:flutter/material.dart';
import '../../core/theme.dart';

class AdminPlansListScreen extends StatelessWidget {
  const AdminPlansListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> mockPlans = [
      {'name': 'Free Tier', 'price': 0.00},
      {'name': 'Student Discount', 'price': 2.99},
      {'name': 'Premium Pro', 'price': 4.99},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription Plans', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Active Packages',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: mockPlans.length,
                itemBuilder: (context, idx) {
                  final plan = mockPlans[idx];
                  final name = plan['name'] as String;
                  final price = plan['price'] as double;

                  return Card(
                    color: PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                      trailing: Text(
                        '\$${price.toStringAsFixed(2)} / mo',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
                      ),
                      leading: const Icon(Icons.card_membership, color: PlanovaTheme.primary),
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
