import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'preferences_provider.dart';

class AccountSetupScreen extends ConsumerStatefulWidget {
  const AccountSetupScreen({super.key});

  @override
  ConsumerState<AccountSetupScreen> createState() => _AccountSetupScreenState();
}

class _AccountSetupScreenState extends ConsumerState<AccountSetupScreen> {
  final _nameController = TextEditingController();
  final _wakeTimeController = TextEditingController(text: '07:00');
  final _sleepTimeController = TextEditingController(text: '23:00');

  void _submitSetup() {
    if (_nameController.text.isNotEmpty) {
      final current = ref.read<PreferencesState>(preferencesProvider);
      final updated = current.copyWith(
        wakeTime: _wakeTimeController.text,
        sleepTime: _sleepTimeController.text,
      );
      ref.read<PreferencesNotifier>(preferencesProvider.notifier).updatePreferences(updated).then((_) {
        if (!mounted) return;
        context.push('/role-selection');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Text(
                "Let's get to know you",
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 12),
              Text(
                'Configure your default schedules to prepare the AI planner.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 32),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Full Name', hintText: 'John Doe'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _wakeTimeController,
                decoration: const InputDecoration(labelText: 'Default Wake Up Time', hintText: '07:00'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _sleepTimeController,
                decoration: const InputDecoration(labelText: 'Default Sleep Time', hintText: '23:00'),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _submitSetup,
                child: const Text('Continue'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
