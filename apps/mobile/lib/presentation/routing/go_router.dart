import 'package:go_router/go_router.dart';
import '../auth/splash_screen.dart';
import '../auth/welcome_screen.dart';
import '../auth/sign_in_screen.dart';
import '../auth/sign_up_screen.dart';
import '../auth/forgot_password_screen.dart';
import '../auth/verification_screen.dart';
import '../auth/account_setup_screen.dart';
import '../auth/role_selection_screen.dart';
import '../home/home_screen.dart';
import '../calendar/calendar_integration_screen.dart';
import '../calendar/sync_settings_screen.dart';
import '../calendar/sync_history_screen.dart';
import '../calendar/widget_config_screen.dart';
import '../calendar/timetable_screen.dart';
import '../calendar/conflict_viewer_screen.dart';
import '../calendar/optimization_log_screen.dart';
import '../alarm/alarm_settings_screen.dart';
import '../alarm/active_alarm_screen.dart';
import '../routine/add_routine_screen.dart';
import '../routine/routines_list_screen.dart';
import '../task/add_task_screen.dart';
import '../task/tasks_list_screen.dart';
import '../subscription/subscription_plans_screen.dart';
import '../subscription/payment_screen.dart';
import '../collaboration/study_room_screen.dart';
import '../collaboration/proposals_list_screen.dart';
import '../collaboration/vote_details_screen.dart';
import '../analytics/analytics_dashboard_screen.dart';
import '../feedback/feedback_screen.dart';
import '../admin/admin_dashboard_screen.dart';
import '../admin/admin_users_list_screen.dart';
import '../admin/admin_plans_list_screen.dart';
import '../admin/admin_system_logs_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/welcome',
      builder: (context, state) => const WelcomeScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const SignInScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const SignUpScreen(),
    ),
    GoRoute(
      path: '/forgot-password',
      builder: (context, state) => const ForgotPasswordScreen(),
    ),
    GoRoute(
      path: '/verify',
      builder: (context, state) => const VerificationScreen(),
    ),
    GoRoute(
      path: '/setup',
      builder: (context, state) => const AccountSetupScreen(),
    ),
    GoRoute(
      path: '/role-selection',
      builder: (context, state) => const RoleSelectionScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/calendar-integration',
      builder: (context, state) => const CalendarIntegrationScreen(),
    ),
    GoRoute(
      path: '/sync-settings',
      builder: (context, state) => const SyncSettingsScreen(),
    ),
    GoRoute(
      path: '/sync-history',
      builder: (context, state) => const SyncHistoryScreen(),
    ),
    GoRoute(
      path: '/widget-config',
      builder: (context, state) => const WidgetConfigScreen(),
    ),
    GoRoute(
      path: '/alarm-settings',
      builder: (context, state) => const AlarmSettingsScreen(),
    ),
    GoRoute(
      path: '/active-alarm',
      builder: (context, state) => const ActiveAlarmScreen(),
    ),
    GoRoute(
      path: '/add-routine',
      builder: (context, state) => const AddRoutineScreen(),
    ),
    GoRoute(
      path: '/routines',
      builder: (context, state) => const RoutinesListScreen(),
    ),
    GoRoute(
      path: '/add-task',
      builder: (context, state) => const AddTaskScreen(),
    ),
    GoRoute(
      path: '/tasks',
      builder: (context, state) => const TasksListScreen(),
    ),
    GoRoute(
      path: '/timetable',
      builder: (context, state) => const TimetableScreen(),
    ),
    GoRoute(
      path: '/conflicts',
      builder: (context, state) => const ConflictViewerScreen(),
    ),
    GoRoute(
      path: '/optimization-log',
      builder: (context, state) => const OptimizationLogScreen(),
    ),
    GoRoute(
      path: '/subscriptions',
      builder: (context, state) => const SubscriptionPlansScreen(),
    ),
    GoRoute(
      path: '/payment',
      builder: (context, state) {
        final plan = state.uri.queryParameters['plan'] ?? 'pro';
        return PaymentScreen(planCode: plan);
      },
    ),
    GoRoute(
      path: '/study-room',
      builder: (context, state) => const StudyRoomScreen(),
    ),
    GoRoute(
      path: '/proposals',
      builder: (context, state) => const ProposalsListScreen(),
    ),
    GoRoute(
      path: '/vote-details',
      builder: (context, state) {
        final id = state.uri.queryParameters['id'] ?? '';
        final title = state.uri.queryParameters['title'] ?? 'Proposal';
        final approvals = int.tryParse(state.uri.queryParameters['approvals'] ?? '0') ?? 0;
        final rejections = int.tryParse(state.uri.queryParameters['rejections'] ?? '0') ?? 0;
        final status = state.uri.queryParameters['status'] ?? 'PENDING';
        return VoteDetailsScreen(
          proposalId: id,
          title: title,
          approvals: approvals,
          rejections: rejections,
          status: status,
        );
      },
    ),
    GoRoute(
      path: '/analytics',
      builder: (context, state) => const AnalyticsDashboardScreen(),
    ),
    GoRoute(
      path: '/feedback',
      builder: (context, state) => const FeedbackScreen(),
    ),
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: '/admin-users',
      builder: (context, state) => const AdminUsersListScreen(),
    ),
    GoRoute(
      path: '/admin-plans',
      builder: (context, state) => const AdminPlansListScreen(),
    ),
    GoRoute(
      path: '/admin-logs',
      builder: (context, state) => const AdminSystemLogsScreen(),
    ),
  ],
);
