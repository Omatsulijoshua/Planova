import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import 'preferences_provider.dart';

class RoleSelectionScreen extends ConsumerStatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  ConsumerState<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends ConsumerState<RoleSelectionScreen> {
  String? _selectedRole;
  final List<String> _roles = ['Student', 'Professional', 'Parent', 'Teacher'];

  void _saveRole() {
    if (_selectedRole != null) {
      final current = ref.read<PreferencesState>(preferencesProvider);
      // Set suggesting mode as default
      final updated = current.copyWith(
        controlMode: 'SUGGEST',
      );
      ref.read<PreferencesNotifier>(preferencesProvider.notifier).updatePreferences(updated).then((_) {
        if (!mounted) return;
        context.go('/home');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Choose Your Role',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'Select the persona that best describes you to unlock specific scheduling features.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 32),
              Column(
                children: _roles.map((role) {
                  final isSelected = _selectedRole == role;
                  return Card(
                    color: isSelected ? PlanovaTheme.primary : PlanovaTheme.surface,
                    margin: const EdgeInsets.only(bottom: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: InkWell(
                      onTap: () => setState(() => _selectedRole = role),
                      borderRadius: BorderRadius.circular(12),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        child: Row(
                          children: [
                            Icon(
                              role == 'Student'
                                  ? Icons.school
                                  : role == 'Professional'
                                      ? Icons.work
                                      : role == 'Parent'
                                          ? Icons.family_restroom
                                          : Icons.record_voice_over,
                              color: Colors.white,
                            ),
                            const SizedBox(width: 16),
                            Text(
                              role,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                            const Spacer(),
                            if (isSelected) const Icon(Icons.check_circle, color: Colors.white),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _selectedRole != null ? _saveRole : null,
                child: const Text('Complete Onboarding'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
