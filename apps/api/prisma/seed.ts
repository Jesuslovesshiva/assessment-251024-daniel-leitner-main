import { PrismaClient } from '@prisma/client';
import { getGravatarUrl } from '../src/modules/core/application/utils/gravatar.util';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      profile: {
        bio: 'Seasoned full-stack developer passionate about clean architecture and mentoring.',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        linkedinUrl: 'https://www.linkedin.com/in/johndoe',
      },
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      profile: {
        bio: 'Product manager focused on delivering delightful user experiences and outcomes.',
        position: 'Product Manager',
        department: 'Product',
        linkedinUrl: 'https://www.linkedin.com/in/janesmith',
      },
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      profile: {
        bio: 'People-first leader helping teams grow through coaching and clear direction.',
        position: 'Engineering Manager',
        department: 'Engineering',
        linkedinUrl: null,
      },
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        profile: {
          create: {
            bio: user.profile.bio,
            position: user.profile.position,
            department: user.profile.department,
            linkedinUrl: user.profile.linkedinUrl ?? undefined,
            gravatarUrl: getGravatarUrl(user.email),
          },
        },
      },
    });
  }

  console.log(`Created ${users.length} users with profiles`);
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
