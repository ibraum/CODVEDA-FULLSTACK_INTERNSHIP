import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyer les données existantes (optionnel)
  await prisma.humanStateHistory.deleteMany();
  await prisma.humanState.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  // Créer des utilisateurs
  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const collabPassword = await bcrypt.hash('collab123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@humanops.com',
      passwordHash: adminPassword,
      role: 'ADMIN_RH',
      isActive: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@humanops.com',
      passwordHash: managerPassword,
      role: 'MANAGER',
      isActive: true,
    },
  });

  const collab1 = await prisma.user.create({
    data: {
      email: 'alice@humanops.com',
      passwordHash: collabPassword,
      role: 'COLLABORATOR',
      isActive: true,
    },
  });

  const collab2 = await prisma.user.create({
    data: {
      email: 'bob@humanops.com',
      passwordHash: collabPassword,
      role: 'COLLABORATOR',
      isActive: true,
    },
  });

  const collab3 = await prisma.user.create({
    data: {
      email: 'charlie@humanops.com',
      passwordHash: collabPassword,
      role: 'COLLABORATOR',
      isActive: true,
    },
  });

  console.log('✅ Users created');

  // Créer une équipe
  const team = await prisma.team.create({
    data: {
      name: 'Équipe Développement',
      managerId: manager.id,
    },
  });

  console.log('✅ Team created');

  // Ajouter des membres à l'équipe
  await prisma.teamMember.create({
    data: {
      userId: collab1.id,
      teamId: team.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: collab2.id,
      teamId: team.id,
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: collab3.id,
      teamId: team.id,
    },
  });

  console.log('✅ Team members added');

  // Créer des états humains pour les collaborateurs
  await prisma.humanState.create({
    data: {
      userId: collab1.id,
      workload: 'NORMAL',
      availability: 'AVAILABLE',
    },
  });

  await prisma.humanState.create({
    data: {
      userId: collab2.id,
      workload: 'HIGH',
      availability: 'MOBILISABLE',
    },
  });

  await prisma.humanState.create({
    data: {
      userId: collab3.id,
      workload: 'LOW',
      availability: 'AVAILABLE',
    },
  });

  console.log('✅ Human states created');

  // Créer des profils collaborateurs
  await prisma.collaboratorProfile.create({
    data: {
      userId: collab1.id,
      preferences: {
        notifications: true,
        workingHours: '9h-18h',
      },
    },
  });

  await prisma.collaboratorProfile.create({
    data: {
      userId: collab2.id,
      preferences: {
        notifications: true,
        workingHours: '10h-19h',
      },
    },
  });

  await prisma.collaboratorProfile.create({
    data: {
      userId: collab3.id,
      preferences: {
        notifications: false,
        workingHours: '8h-17h',
      },
    },
  });

  console.log('✅ Collaborator profiles created');

  // Créer des compétences
  const skillJS = await prisma.skill.create({
    data: { name: 'JavaScript' },
  });

  const skillTS = await prisma.skill.create({
    data: { name: 'TypeScript' },
  });

  const skillReact = await prisma.skill.create({
    data: { name: 'React' },
  });

  const skillNode = await prisma.skill.create({
    data: { name: 'Node.js' },
  });

  console.log('✅ Skills created');

  // Assigner des compétences aux collaborateurs
  const aliceProfile = await prisma.collaboratorProfile.findUnique({
    where: { userId: collab1.id },
  });

  const bobProfile = await prisma.collaboratorProfile.findUnique({
    where: { userId: collab2.id },
  });

  const charlieProfile = await prisma.collaboratorProfile.findUnique({
    where: { userId: collab3.id },
  });

  if (aliceProfile) {
    await prisma.collaboratorSkill.createMany({
      data: [
        { collaboratorId: aliceProfile.id, skillId: skillJS.id },
        { collaboratorId: aliceProfile.id, skillId: skillReact.id },
      ],
    });
  }

  if (bobProfile) {
    await prisma.collaboratorSkill.createMany({
      data: [
        { collaboratorId: bobProfile.id, skillId: skillTS.id },
        { collaboratorId: bobProfile.id, skillId: skillNode.id },
      ],
    });
  }

  if (charlieProfile) {
    await prisma.collaboratorSkill.createMany({
      data: [
        { collaboratorId: charlieProfile.id, skillId: skillJS.id },
        { collaboratorId: charlieProfile.id, skillId: skillTS.id },
        { collaboratorId: charlieProfile.id, skillId: skillNode.id },
      ],
    });
  }

  console.log('✅ Skills assigned to collaborators');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📝 Test accounts:');
  console.log('  Admin RH:');
  console.log('    Email: admin@humanops.com');
  console.log('    Password: admin123');
  console.log('');
  console.log('  Manager:');
  console.log('    Email: manager@humanops.com');
  console.log('    Password: manager123');
  console.log('');
  console.log('  Collaborateurs:');
  console.log('    Email: alice@humanops.com / bob@humanops.com / charlie@humanops.com');
  console.log('    Password: collab123');
  console.log('');
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
