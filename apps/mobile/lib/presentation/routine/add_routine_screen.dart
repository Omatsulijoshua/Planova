import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AddRoutineScreen extends StatefulWidget {
  const AddRoutineScreen({super.key});

  @override
  State<AddRoutineScreen> createState() => _AddRoutineScreenState();
}

class _AddRoutineScreenState extends State<AddRoutineScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _durationController = TextEditingController(text: '30');
  String _selectedCategory = 'Study';
  String _selectedPriority = 'MEDIUM';
  String _selectedFlexibility = 'FLEXIBLE';

  void _saveRoutine() {
    if (_formKey.currentState!.validate()) {
      final duration = int.tryParse(_durationController.text);
      if (duration == null || duration <= 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error: Duration must be positive!')),
        );
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Routine Created successfully (Mocked)')),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Routine', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Configure Routine',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Routine Title', hintText: 'e.g., Morning Coding'),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Title is required' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedCategory,
                decoration: const InputDecoration(labelText: 'Category'),
                items: const [
                  DropdownMenuItem(value: 'Study', child: Text('STUDY')),
                  DropdownMenuItem(value: 'Work', child: Text('WORK')),
                  DropdownMenuItem(value: 'Exercise', child: Text('EXERCISE')),
                  DropdownMenuItem(value: 'Personal', child: Text('PERSONAL')),
                ],
                onChanged: (val) => setState(() => _selectedCategory = val!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _durationController,
                decoration: const InputDecoration(labelText: 'Duration (Minutes)'),
                keyboardType: TextInputType.number,
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Duration is required' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedPriority,
                decoration: const InputDecoration(labelText: 'Priority'),
                items: const [
                  DropdownMenuItem(value: 'LOW', child: Text('LOW')),
                  DropdownMenuItem(value: 'MEDIUM', child: Text('MEDIUM')),
                  DropdownMenuItem(value: 'HIGH', child: Text('HIGH')),
                ],
                onChanged: (val) => setState(() => _selectedPriority = val!),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedFlexibility,
                decoration: const InputDecoration(labelText: 'Flexibility'),
                items: const [
                  DropdownMenuItem(value: 'FLEXIBLE', child: Text('FLEXIBLE')),
                  DropdownMenuItem(value: 'FIXED', child: Text('FIXED')),
                ],
                onChanged: (val) => setState(() => _selectedFlexibility = val!),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _saveRoutine,
                child: const Text('Save Routine'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
