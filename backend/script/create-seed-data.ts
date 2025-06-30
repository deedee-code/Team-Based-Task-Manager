import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../src/common/entities/user.entity';
import { Team } from '../src/common/entities/team.entity';
import { TeamMember } from '../src/common/entities/team-member.entity';
import { Task } from '../src/common/entities/task.entity';
import { TeamRole } from '../src/common/enums/team-role.enum';
import { TaskStatus } from '../src/common/enums/task-status.enum';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'team_task_manager',
  entities: [User, Team, TeamMember, Task],
  synchronize: true,
});

async function seedDatabase() {
  await dataSource.initialize();

  // Clear existing data
  await dataSource.getRepository(Task).delete({});
  await dataSource.getRepository(TeamMember).delete({});
  await dataSource.getRepository(Team).delete({});
  await dataSource.getRepository(User).delete({});

  const userRepository = dataSource.getRepository(User);
  const teamRepository = dataSource.getRepository(Team);
  const teamMemberRepository = dataSource.getRepository(TeamMember);
  const taskRepository = dataSource.getRepository(Task);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const john = userRepository.create({
    username: 'john_doe',
    email: 'john@example.com',
    password: hashedPassword,
  });

  const jane = userRepository.create({
    username: 'jane_smith',
    email: 'jane@example.com',
    password: hashedPassword,
  });

  const bob = userRepository.create({
    username: 'bob_wilson',
    email: 'bob@example.com',
    password: hashedPassword,
  });

  await userRepository.save([john, jane, bob]);

  // Create teams
  const frontendTeam = teamRepository.create({
    name: 'Frontend Development',
    description: 'Team responsible for UI/UX development',
    createdBy: john,
  });

  const backendTeam = teamRepository.create({
    name: 'Backend Development',
    description: 'Team responsible for API and database development',
    createdBy: jane,
  });

  await teamRepository.save([frontendTeam, backendTeam]);

  // Create team memberships
  const memberships = [
    // Frontend team
    { user: john, team: frontendTeam, role: TeamRole.ADMIN },
    { user: jane, team: frontendTeam, role: TeamRole.MEMBER },

    // Backend team
    { user: jane, team: backendTeam, role: TeamRole.ADMIN },
    { user: bob, team: backendTeam, role: TeamRole.MEMBER },
    { user: john, team: backendTeam, role: TeamRole.MEMBER },
  ];

  for (const membership of memberships) {
    const teamMember = teamMemberRepository.create(membership);
    await teamMemberRepository.save(teamMember);
  }

  // Create tasks
  const tasks = [
    {
      title: 'Design Login Page',
      description: 'Create wireframes and mockups for the login page',
      status: TaskStatus.TODO,
      team: frontendTeam,
      createdBy: john,
      assignedTo: jane,
    },
    {
      title: 'Implement Authentication API',
      description: 'Create JWT-based authentication endpoints',
      status: TaskStatus.IN_PROGRESS,
      team: backendTeam,
      createdBy: jane,
      assignedTo: bob,
    },
    {
      title: 'Setup Database Schema',
      description: 'Create database tables and relationships',
      status: TaskStatus.DONE,
      team: backendTeam,
      createdBy: jane,
      assignedTo: null,
    },
    {
      title: 'Create Dashboard Components',
      description: 'Build reusable dashboard components',
      status: TaskStatus.TODO,
      team: frontendTeam,
      createdBy: john,
      assignedTo: null,
    },
    {
      title: 'Write API Tests',
      description: 'Create comprehensive test suite for all endpoints',
      status: TaskStatus.TODO,
      team: backendTeam,
      createdBy: bob,
      assignedTo: john,
    },
  ];

  for (const taskData of tasks) {
    const task = taskRepository.create(taskData);
    await taskRepository.save(task);
  }

  console.log('Database seeded successfully!');
  await dataSource.destroy();
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
