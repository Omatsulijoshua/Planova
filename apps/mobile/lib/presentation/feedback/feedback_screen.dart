import 'package:flutter/material.dart';
import '../../core/theme.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  final _commentController = TextEditingController();
  int _rating = 5;
  String _selectedType = 'TIMETABLE_QUALITY';

  void _submitFeedback() {
    if (_commentController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error: Comments cannot be empty!')),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Thank you! $_rating-star feedback submitted successfully.')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit Feedback', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Tell us your thoughts',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            DropdownButtonFormField<String>(
              initialValue: _selectedType,
              decoration: const InputDecoration(labelText: 'Feedback Category'),
              items: const [
                DropdownMenuItem(value: 'TIMETABLE_QUALITY', child: Text('TIMETABLE QUALITY')),
                DropdownMenuItem(value: 'BUG_REPORT', child: Text('BUG REPORT')),
                DropdownMenuItem(value: 'FEATURE_REQUEST', child: Text('FEATURE REQUEST')),
              ],
              onChanged: (val) => setState(() => _selectedType = val!),
            ),
            const SizedBox(height: 24),
            const Text(
              'Your Rating',
              style: TextStyle(fontWeight: FontWeight.bold, color: PlanovaTheme.secondary),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (idx) {
                final starValue = idx + 1;
                return IconButton(
                  icon: Icon(
                    starValue <= _rating ? Icons.star : Icons.star_border,
                    size: 40,
                    color: Colors.amber,
                  ),
                  onPressed: () => setState(() => _rating = starValue),
                );
              }),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _commentController,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Comments',
                hintText: 'Share your thoughts or report a problem...',
              ),
            ),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: _submitFeedback,
              child: const Text('Submit Feedback'),
            ),
          ],
        ),
      ),
    );
  }
}
