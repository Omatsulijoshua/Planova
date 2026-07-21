import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class PaymentScreen extends StatefulWidget {
  final String planCode;

  const PaymentScreen({
    super.key,
    this.planCode = 'pro',
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _cardNumberController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();

  void _triggerPayment(bool success) {
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment Successful! ${widget.planCode.toUpperCase()} subscription active.')),
      );
      context.go('/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error: Payment declined. Please check details or grace period.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout', style: TextStyle(fontFamily: 'Outfit')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Secure Payment',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Subscribing to Planova ${widget.planCode.toUpperCase()} Plan.',
              style: const TextStyle(color: PlanovaTheme.textSecondary),
            ),
            const SizedBox(height: 32),
            TextField(
              controller: _cardNumberController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Card Number', hintText: '4111 1111 1111 1111'),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _expiryController,
                    decoration: const InputDecoration(labelText: 'Expiry Date', hintText: 'MM/YY'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextField(
                    controller: _cvvController,
                    obscureText: true,
                    decoration: const InputDecoration(labelText: 'CVV', hintText: '***'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: () => _triggerPayment(true),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: const Text('Simulate Success Payment'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => _triggerPayment(false),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
              child: const Text('Simulate Decline Payment'),
            ),
          ],
        ),
      ),
    );
  }
}
