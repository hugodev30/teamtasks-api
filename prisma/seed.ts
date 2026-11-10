import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// IDs fixos para garantir idempotência
const IDS = {
  team: "11111111-1111-4111-8111-111111111111",
  project: "22222222-2222-4222-8222-222222222222",
  tasks: {
    todo: "33333333-3333-4333-8333-333333333331",
    inProgress: "33333333-3333-4333-8333-333333333332",
    done: "33333333-3333-4333-8333-333333333333",
  },
  comment: "44444444-4444-4444-8444-444444444444",
};

async function main() {
  // 1. Hash da senha
  const passwordHash = await bcrypt.hash("password123", 10);

  // 2. Criar usuários
  const owner = await prisma.user.upsert({
    where: {
      email: "owner@teamtasks.dev",
    },
    update: {},
    create: {
      name: "Team Owner",
      email: "owner@teamtasks.dev",
      passwordHash,
    },
  });

  const member = await prisma.user.upsert({
    where: {
      email: "member@teamtasks.dev",
    },
    update: {},
    create: {
      name: "Team Member",
      email: "member@teamtasks.dev",
      passwordHash,
    },
  });

  // 3. Criar time
  const team = await prisma.team.upsert({
    where: {
      id: IDS.team,
    },
    update: {},
    create: {
      id: IDS.team,
      name: "Development Team",
    },
  });

  // 4. Criar memberships
  await prisma.membership.upsert({
    where: {
      userId_teamId: {
        userId: owner.id,
        teamId: team.id,
      },
    },
    update: {
      role: "OWNER",
    },
    create: {
      userId: owner.id,
      teamId: team.id,
      role: "OWNER",
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_teamId: {
        userId: member.id,
        teamId: team.id,
      },
    },
    update: {
      role: "MEMBER",
    },
    create: {
      userId: member.id,
      teamId: team.id,
      role: "MEMBER",
    },
  });

  // 5. Criar projeto
  const project = await prisma.project.upsert({
    where: {
      id: IDS.project,
    },
    update: {},
    create: {
      id: IDS.project,
      name: "TeamTasks API",
      description: "Project for task management",
      teamId: team.id,
    },
  });

  // 6. Criar tasks
  const tasks = [
    {
      id: IDS.tasks.todo,
      title: "Implement authentication",
      description: "Implement user authentication",
      status: "TODO" as const,
    },
    {
      id: IDS.tasks.inProgress,
      title: "Create task endpoints",
      description: "Implement CRUD endpoints for tasks",
      status: "IN_PROGRESS" as const,
    },
    {
      id: IDS.tasks.done,
      title: "Configure database",
      description: "Configure Prisma and PostgreSQL",
      status: "DONE" as const,
    },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: {
        id: task.id,
      },
      update: {},
      create: {
        ...task,
        projectId: project.id,
        creatorId: owner.id,
        assigneeId: member.id,
      },
    });
  }

  // 7. Criar comentário
  await prisma.comment.upsert({
    where: {
      id: IDS.comment,
    },
    update: {},
    create: {
      id: IDS.comment,
      content: "Task is progressing as expected!",
      taskId: IDS.tasks.inProgress,
      authorId: member.id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Error while seeding database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
