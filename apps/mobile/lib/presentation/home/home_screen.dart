import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Planova Dashboard', style: TextStyle(fontFamily: 'Outfit')),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => context.go('/welcome'),
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.stars,
                size: 80,
                color: PlanovaTheme.secondary,
              ),
              const SizedBox(height: 24),
              Text(
                'Optimized Schedule Ready',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 12),
              const Text(
                'Your AI onboarding is complete. Explore tasks, routines, and calendar views.',
                textAlign: TextAlign.center,
                style: TextStyle(color: PlanovaTheme.textSecondary, fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
