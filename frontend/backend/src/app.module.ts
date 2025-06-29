import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { TeamsModule } from "./teams/teams.module"
import { TasksModule } from "./tasks/tasks.module"
import { User } from "./users/entities/user.entity"
import { Team } from "./teams/entities/team.entity"
import { TeamMember } from "./teams/entities/team-member.entity"
import { Task } from "./tasks/entities/task.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "team_task_manager",
      entities: [User, Team, TeamMember, Task],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    AuthModule,
    UsersModule,
    TeamsModule,
    TasksModule,
  ],
})
export class AppModule {}
