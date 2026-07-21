import 'package:flutter/material.dart';

class PlanovaTheme {
  static const Color primary = Color(0xFF6C5CE7);
  static const Color secondary = Color(0xFF00CEC9);
  static const Color background = Color(0xFF0F0C20);
  static const Color surface = Color(0xFF1A1635);
  static const Color text = Colors.white;
  static const Color textSecondary = Color(0xFFA09CB0);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: primary,
      scaffoldBackgroundColor: background,
      cardColor: surface,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: secondary,
        surface: surface,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            fontFamily: 'Outfit',
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
        labelStyle: const TextStyle(color: textSecondary, fontSize: 14),
        hintStyle: const TextStyle(color: textSecondary, fontSize: 14),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: text, fontFamily: 'Outfit'),
        headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: text, fontFamily: 'Outfit'),
        titleMedium: TextStyle(fontSize: 18, color: text, fontFamily: 'Inter'),
        bodyMedium: TextStyle(fontSize: 14, color: textSecondary, fontFamily: 'Inter'),
      ),
    );
  }
}
