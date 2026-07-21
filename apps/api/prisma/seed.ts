import { config } from "dotenv";
import path from "path";
// Load environment variables from root
config({ path: path.resolve(__dirname, "../../../.env") });

import { PrismaClient, UserStatus, UserRoleType, SubscriptionStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as crypto from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Roles
  const rolesData = Object.values(UserRoleType);
  const roles = [];
  for (const roleType of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: roleType },
      update: {},
      create: {
        name: roleType,
        type: roleType,
      },
    });
    roles.push(role);
  }
  console.log(`Seeded ${roles.length} roles.`);

  // 2. Seed Permissions
  const permissionsData = [
    { action: 'create', resource: 'timetable' },
    { action: 'read', resource: 'timetable' },
    { action: 'update', resource: 'timetable' },
    { action: 'delete', resource: 'timetable' },
    { action: 'share', resource: 'timetable' },
    { action: 'optimize', resource: 'timetable' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const permission = await prisma.permission.create({
      data: {
        action: p.action,
        resource: p.resource,
      },
    });
    permissions.push(permission);
  }
  console.log(`Seeded ${permissions.length} permissions.`);

  // Link permissions to Admin Role
  const adminRole = roles.find((r) => r.type === UserRoleType.ADMIN);
  if (adminRole) {
    await prisma.role.update({
      where: { id: adminRole.id },
      data: {
        permissions: {
          connect: permissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  // 3. Seed Subscription Plans
  const plans = [
    { name: 'Free Plan', code: 'free', price: 0.0, features: { aiQuota: 3, maxTimetables: 1 } },
    { name: 'Student Plan', code: 'student', price: 4.99, features: { aiQuota: 50, maxTimetables: 5, academicModules: true } },
    { name: 'Personal Pro Plan', code: 'pro', price: 9.99, features: { aiQuota: 200, maxTimetables: 10, advancedAlarms: true } },
    { name: 'Enterprise Plan', code: 'enterprise', price: 49.99, features: { aiQuota: 9999, maxTimetables: 99, orgFeatures: true } },
  ];

  const seededPlans = [];
  for (const plan of plans) {
    const p = await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: {},
      create: {
        name: plan.name,
        code: plan.code,
        price: plan.price,
        currency: 'USD',
        interval: 'month',
        features: plan.features,
      },
    });
    seededPlans.push(p);
  }
  console.log(`Seeded ${seededPlans.length} subscription plans.`);

  // 4. Seed App Settings & Feature Flags
  await prisma.appSetting.upsert({
    where: { key: 'maintenance_mode' },
    update: {},
    create: {
      key: 'maintenance_mode',
      value: 'false',
    },
  });

  await prisma.featureFlag.upsert({
    where: { name: 'ai_planner_v2' },
    update: {},
    create: {
      name: 'ai_planner_v2',
      isEnabled: true,
    },
  });
  console.log('Seeded app settings and feature flags.');

  // 5. Seed Users
  // Hash for password 'password123' (Dummy hash, in prod we hash with Argon2)
  const passwordHash = crypto.createHash('sha256').update('password123').digest('hex');

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@planova.ai' },
    update: {},
    create: {
      email: 'admin@planova.ai',
      passwordHash: passwordHash,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          phoneNumber: '+1234567890',
          persona: 'System Admin',
        },
      },
      preference: {
        create: {
          timezone: 'UTC',
          wakeTime: '06:00',
          sleepTime: '22:00',
          controlMode: 'SUGGEST',
        },
      },
    },
  });

  // Link roles to Admin user
  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });
  }

  // Student User
  const studentRole = roles.find((r) => r.type === UserRoleType.STUDENT);
  const freePlan = seededPlans.find((p) => p.code === 'free');

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@planova.ai' },
    update: {},
    create: {
      email: 'student@planova.ai',
      passwordHash: passwordHash,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+1987654321',
          persona: 'Student',
        },
      },
      preference: {
        create: {
          timezone: 'Africa/Lagos',
          wakeTime: '07:00',
          sleepTime: '23:00',
          workDays: [1, 2, 3, 4, 5],
          controlMode: 'SUGGEST',
        },
      },
    },
  });

  if (studentRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: studentUser.id,
          roleId: studentRole.id,
        },
      },
      update: {},
      create: {
        userId: studentUser.id,
        roleId: studentRole.id,
      },
    });
  }

  // Assign Free Subscription to Student
  if (freePlan) {
    await prisma.subscription.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        planId: freePlan.id,
        status: SubscriptionStatus.ACTIVE,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        paymentGateway: 'stripe',
      },
    });
  }

  console.log('Seeded sample users.');
  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
