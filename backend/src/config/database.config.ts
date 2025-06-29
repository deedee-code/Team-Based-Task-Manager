import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  database: process.env.DB_DATABASE ?? 'team_task_manager',
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT,
}));
