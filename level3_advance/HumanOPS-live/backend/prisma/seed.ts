import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Cleaning up existing data
  console.log("Cleaning up existing data...");
  await prisma.reinforcementResponseModel.deleteMany();
  await prisma.reinforcementRequest.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.tensionLevelSnapshot.deleteMany();
  await prisma.reliabilityScore.deleteMany();
  await prisma.collaboratorSkill.deleteMany();
  await prisma.collaboratorProfile.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.humanStateHistory.deleteMany();
  await prisma.humanState.deleteMany();
  await prisma.team.deleteMany();
  await prisma.rHSettingHistory.deleteMany();
  await prisma.rHSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Creating Users
  console.log("Creating users...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Admin
  await prisma.user.create({
    data: {
      email: "admin@humanops.com",
      passwordHash,
      firstName: "Admin",
      lastName: "System",
      role: "ADMIN_RH",
      isActive: true,
      profile: {
        create: {
          preferences: { theme: "dark", notifications: true },
        },
      },
    },
  });

  // Managers
  const managerFrontend = await prisma.user.create({
    data: {
      email: "sarah.mitchell@humanops.com",
      passwordHash,
      firstName: "Sarah",
      lastName: "Mitchell",
      role: "MANAGER",
      isActive: true,
      profile: {
        create: {
          preferences: { theme: "light", notifications: true },
        },
      },
    },
  });

  const managerBackend = await prisma.user.create({
    data: {
      email: "david.chen@humanops.com",
      passwordHash,
      firstName: "David",
      lastName: "Chen",
      role: "MANAGER",
      isActive: true,
      profile: {
        create: {
          preferences: { theme: "dark", notifications: true },
        },
      },
    },
  });

  // Collaborators - Frontend
  const dev1 = await prisma.user.create({
    data: {
      email: "alice.dupont@humanops.com",
      passwordHash,
      firstName: "Alice",
      lastName: "Dupont",
      role: "COLLABORATOR",
      isActive: true,
      reliability: { create: { score: 0.95 } },
      profile: {
        create: {
          preferences: { workingHours: "09:00-18:00" },
        },
      },
    },
  });

  const dev2 = await prisma.user.create({
    data: {
      email: "bob.martin@humanops.com",
      passwordHash,
      firstName: "Bob",
      lastName: "Martin",
      role: "COLLABORATOR",
      isActive: true,
      reliability: { create: { score: 0.88 } },
      profile: {
        create: {
          preferences: { workingHours: "10:00-19:00" },
        },
      },
    },
  });

  // Collaborators - Backend
  const dev3 = await prisma.user.create({
    data: {
      email: "charlie.davis@humanops.com",
      passwordHash,
      firstName: "Charlie",
      lastName: "Davis",
      role: "COLLABORATOR",
      isActive: true,
      reliability: { create: { score: 0.92 } },
      profile: {
        create: {
          preferences: { workingHours: "08:00-17:00" },
        },
      },
    },
  });

  const dev4 = await prisma.user.create({
    data: {
      email: "diana.ross@humanops.com",
      passwordHash,
      firstName: "Diana",
      lastName: "Ross",
      role: "COLLABORATOR",
      isActive: true,
      reliability: { create: { score: 0.98 } },
      profile: {
        create: {
          preferences: { workingHours: "09:00-17:00" },
        },
      },
    },
  });

  console.log("Users created.");

  // 3. Creating Skills
  console.log("Creating skills...");
  const skillsData = [
    { name: "React" },
    { name: "Vue.js" },
    { name: "TypeScript" },
    { name: "Node.js" },
    { name: "Python" },
    { name: "Docker" },
    { name: "AWS" },
    { name: "PostgreSQL" },
    { name: "Communication" },
    { name: "Leadership" },
  ];

  const skills: Record<string, any> = {};
  for (const s of skillsData) {
    skills[s.name] = await prisma.skill.create({ data: s });
  }

  // Assign skills to collaborators
  const assignSkill = async (userId: string, skillNames: string[]) => {
    const profile = await prisma.collaboratorProfile.findUnique({
      where: { userId },
    });
    if (!profile) return;

    for (const name of skillNames) {
      if (skills[name]) {
        await prisma.collaboratorSkill.create({
          data: {
            collaboratorId: profile.id,
            skillId: skills[name].id,
          },
        });
      }
    }
  };

  await assignSkill(dev1.id, ["React", "TypeScript", "Communication"]);
  await assignSkill(dev2.id, ["Vue.js", "TypeScript", "Docker"]);
  await assignSkill(dev3.id, ["Node.js", "PostgreSQL", "AWS"]);
  await assignSkill(dev4.id, ["Python", "Docker", "Leadership"]);

  console.log("Skills created and assigned.");

  // 4. Creating Teams
  console.log("Creating teams...");

  const teamFrontend = await prisma.team.create({
    data: {
      name: "Frontend Squad",
      managerId: managerFrontend.id,
      members: {
        create: [{ userId: dev1.id }, { userId: dev2.id }],
      },
    },
  });

  const teamBackend = await prisma.team.create({
    data: {
      name: "Backend Squad",
      managerId: managerBackend.id,
      members: {
        create: [{ userId: dev3.id }, { userId: dev4.id }],
      },
    },
  });

  console.log("Teams created.");

  // 5. Creating Human States
  console.log("Setting human states...");

  await prisma.humanState.create({
    data: {
      userId: dev1.id,
      workload: "NORMAL",
      availability: "AVAILABLE",
    },
  });

  await prisma.humanState.create({
    data: {
      userId: dev2.id,
      workload: "HIGH",
      availability: "MOBILISABLE",
    },
  });

  await prisma.humanState.create({
    data: {
      userId: dev3.id,
      workload: "LOW",
      availability: "AVAILABLE",
    },
  });

  await prisma.humanState.create({
    data: {
      userId: dev4.id,
      workload: "NORMAL",
      availability: "UNAVAILABLE", // Maybe in a meeting
    },
  });

  console.log("Human states set.");

  // 6. Creating Tension Snapshots
  console.log("Creating tension snapshots...");

  await prisma.tensionLevelSnapshot.create({
    data: {
      teamId: teamFrontend.id,
      level: "MODERATE",
      metrics: {
        deadlines: "tight",
        mood: "focused",
      },
    },
  });

  await prisma.tensionLevelSnapshot.create({
    data: {
      teamId: teamBackend.id,
      level: "LOW",
      metrics: {
        deadlines: "comfortable",
        mood: "relaxed",
      },
    },
  });

  // 7. Creating Alerts
  console.log("Creating alerts...");

  await prisma.alert.create({
    data: {
      type: "TENSION_HIGH",
      userId: managerFrontend.id,
      isRead: false,
      payload: {
        message: "Frontend Squad is experiencing high workload.",
        teamId: teamFrontend.id,
      },
    },
  });

  await prisma.alert.create({
    data: {
      type: "RELIABILITY_DROP",
      targetRole: "ADMIN_RH",
      isRead: false,
      payload: {
        message: "Global reliability score dropped slightly.",
      },
    },
  });

  console.log("Alerts created.");

  console.log("");
  console.log("Seeding completed successfully!");
  console.log("");
  console.log("Test Accounts:");
  console.log("  Admin:   admin@humanops.com / password123");
  console.log("  Manager: sarah.mitchell@humanops.com / password123");
  console.log("  Manager: david.chen@humanops.com / password123");
  console.log(
    "  Devs:    alice.dupont@humanops.com (and others) / password123"
  );
  console.log("");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
