import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class SubscriptionPlansScreen extends StatelessWidget {
  const SubscriptionPlansScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upgrade Planova', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Choose Your Plan',
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Unlock advanced AI features and calendar integrations.',
              style: TextStyle(color: PlanovaTheme.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            _buildPlanCard(
              context: context,
              title: 'FREE TIER',
              price: '\$0.00 / mo',
              description: 'Standard alarm constraints, 1 calendar sync.',
              isPopular: false,
              planCode: 'free',
            ),
            const SizedBox(height: 16),
            _buildPlanCard(
              context: context,
              title: 'STUDENT DISCOUNT',
              price: '\$2.99 / mo',
              description: 'Advanced AI scheduling, multi-calendar sync, 14 days trial.',
              isPopular: false,
              planCode: 'student',
            ),
            const SizedBox(height: 16),
            _buildPlanCard(
              context: context,
              title: 'PREMIUM PRO',
              price: '\$4.99 / mo',
              description: 'Advanced AI scheduling, multi-calendar sync, priority progressive alarms.',
              isPopular: true,
              planCode: 'pro',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard({
    required BuildContext context,
    required String title,
    required String price,
    required String description,
    required bool isPopular,
    required String planCode,
  }) {
    return Card(
      color: PlanovaTheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isPopular ? PlanovaTheme.secondary : Colors.transparent,
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (isPopular)
              const Align(
                alignment: Alignment.topRight,
                child: Chip(
                  label: Text('POPULAR', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  backgroundColor: PlanovaTheme.secondary,
                ),
              ),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: PlanovaTheme.primary)),
            const SizedBox(height: 8),
            Text(price, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
            const SizedBox(height: 8),
            Text(description, style: const TextStyle(color: PlanovaTheme.textSecondary)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                if (planCode == 'free') {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Free Tier Activated')),
                  );
                } else {
                  context.push('/payment?plan=$planCode');
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: isPopular ? PlanovaTheme.secondary : PlanovaTheme.primary,
              ),
              child: Text(planCode == 'free' ? 'Stay Free' : 'Choose Plan'),
            ),
          ],
        ),
      ),
    );
  }
}
