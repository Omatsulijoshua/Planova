import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme.dart';
import 'presentation/routing/go_router.dart';

void main() {
  runApp(
    const ProviderScope(
      child: PlanovaApp(),
    ),
  );
}

class PlanovaApp extends StatelessWidget {
  const PlanovaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Planova AI Timetable',
      theme: PlanovaTheme.darkTheme,
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
