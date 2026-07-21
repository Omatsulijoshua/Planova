import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  bool _maintenanceMode = false;
  bool _aiPlannerV2Flag = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Panel', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'System Settings',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            SwitchListTile(
              title: const Text('Maintenance Mode'),
              subtitle: const Text('Block all incoming non-admin requests'),
              value: _maintenanceMode,
              onChanged: (val) {
                setState(() => _maintenanceMode = val);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Maintenance Mode: ${val ? "Enabled" : "Disabled"}')),
                );
              },
              contentPadding: EdgeInsets.zero,
            ),
            SwitchListTile(
              title: const Text('Feature Flag: AI Planner v2'),
              subtitle: const Text('Enable advanced CSP heuristics engine'),
              value: _aiPlannerV2Flag,
              onChanged: (val) {
                setState(() => _aiPlannerV2Flag = val);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('AI Planner v2 Flag: ${val ? "On" : "Off"}')),
                );
              },
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 32),
            const Text(
              'Management Catalog',
              style: TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            _buildAdminMenuCard(
              context: context,
              title: 'Registered Users',
              description: 'Manage accounts and role permissions.',
              icon: Icons.people_outline,
              route: '/admin-users',
            ),
            const SizedBox(height: 12),
            _buildAdminMenuCard(
              context: context,
              title: 'Subscription Plans',
              description: 'Configure student and premium prices.',
              icon: Icons.credit_card_outlined,
              route: '/admin-plans',
            ),
            const SizedBox(height: 12),
            _buildAdminMenuCard(
              context: context,
              title: 'System Logs',
              description: 'Filter audit actions and error reports.',
              icon: Icons.receipt_long_outlined,
              route: '/admin-logs',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdminMenuCard({
    required BuildContext context,
    required String title,
    required String description,
    required IconData icon,
    required String route,
  }) {
    return Card(
      color: PlanovaTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        onTap: () => context.push(route),
        leading: Icon(icon, color: PlanovaTheme.primary, size: 28),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(description),
        trailing: const Icon(Icons.chevron_right, color: PlanovaTheme.textSecondary),
      ),
    );
  }
}
