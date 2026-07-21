import 'package:flutter/material.dart';
import '../../core/theme.dart';

class SocialSignInWidget extends StatelessWidget {
  const SocialSignInWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Row(
          children: [
            Expanded(child: Divider(color: PlanovaTheme.textSecondary)),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Text('OR CONNECT WITH'),
            ),
            Expanded(child: Divider(color: PlanovaTheme.textSecondary)),
          ],
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  side: const BorderSide(color: PlanovaTheme.textSecondary),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.g_mobiledata, size: 28, color: Colors.white),
                    SizedBox(width: 8),
                    Text('Google', style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  side: const BorderSide(color: PlanovaTheme.textSecondary),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.apple, size: 24, color: Colors.white),
                    SizedBox(width: 8),
                    Text('Apple', style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
