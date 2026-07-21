import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'alarm_service.dart';

class ActiveAlarmScreen extends StatefulWidget {
  final AlarmType alarmType;

  const ActiveAlarmScreen({
    super.key,
    this.alarmType = AlarmType.captcha,
  });

  @override
  State<ActiveAlarmScreen> createState() => _ActiveAlarmScreenState();
}

class _ActiveAlarmScreenState extends State<ActiveAlarmScreen> {
  final _captchaController = TextEditingController();
  bool _canDismiss = false;

  @override
  void initState() {
    super.initState();
    if (widget.alarmType != AlarmType.captcha) {
      _canDismiss = true;
    }
  }

  void _verifyCaptcha(String text) {
    if (text == '15') {
      setState(() => _canDismiss = true);
    } else {
      setState(() => _canDismiss = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isCaptcha = widget.alarmType == AlarmType.captcha;

    return Scaffold(
      backgroundColor: Colors.red.shade900,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(
                Icons.alarm,
                size: 100,
                color: Colors.white,
              ),
              const SizedBox(height: 24),
              const Center(
                child: Text(
                  'ALARM RINGING',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 2),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  'Style: ${widget.alarmType.name.toUpperCase()}',
                  style: const TextStyle(fontSize: 16, color: Colors.white70),
                ),
              ),
              const SizedBox(height: 48),
              if (isCaptcha) ...[
                const Card(
                  color: Colors.black26,
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Text(
                          'Solve to Dismiss:',
                          style: TextStyle(fontSize: 14, color: Colors.white70),
                        ),
                        SizedBox(height: 8),
                        Text(
                          '7 + 8 = ?',
                          key: Key('captcha_equation'),
                          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  key: const Key('captcha_field'),
                  controller: _captchaController,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white, fontSize: 18),
                  decoration: const InputDecoration(
                    fillColor: Colors.black38,
                    hintText: 'Enter answer',
                    hintStyle: TextStyle(color: Colors.white54),
                  ),
                  onChanged: _verifyCaptcha,
                ),
                const SizedBox(height: 32),
              ],
              ElevatedButton(
                key: const Key('dismiss_button'),
                onPressed: _canDismiss ? () => context.go('/home') : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _canDismiss ? Colors.green : Colors.grey,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Dismiss Alarm'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
