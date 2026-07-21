import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AddTaskScreen extends StatefulWidget {
  const AddTaskScreen({super.key});

  @override
  State<AddTaskScreen> createState() => _AddTaskScreenState();
}

class _AddTaskScreenState extends State<AddTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _durationController = TextEditingController(text: '60');
  String _selectedPriority = 'MEDIUM';
  String _selectedCategory = 'Study';
  bool _hasDependency = false;

  void _saveTask() {
    if (_formKey.currentState!.validate()) {
      final duration = int.tryParse(_durationController.text);
      if (duration == null || duration <= 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error: Duration must be positive!')),
        );
        return;
      }

      if (_hasDependency && _titleController.text == 'Circle Task') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error: Dependency cycle detected!')),
        );
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Task Created successfully (Mocked)')),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Task', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Configure Task',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Task Title', hintText: 'e.g., Study Math exam'),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Title is required' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedCategory,
                decoration: const InputDecoration(labelText: 'Category'),
                items: const [
                  DropdownMenuItem(value: 'Study', child: Text('STUDY')),
                  DropdownMenuItem(value: 'Work', child: Text('WORK')),
                  DropdownMenuItem(value: 'Personal', child: Text('PERSONAL')),
                ],
                onChanged: (val) => setState(() => _selectedCategory = val!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _durationController,
                decoration: const InputDecoration(labelText: 'Estimated Time (Minutes)'),
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
              SwitchListTile(
                title: const Text('Has Task Dependencies'),
                value: _hasDependency,
                onChanged: (val) => setState(() => _hasDependency = val),
                contentPadding: EdgeInsets.zero,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _saveTask,
                child: const Text('Save Task'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
