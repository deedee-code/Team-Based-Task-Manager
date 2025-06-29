import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../../common/entities/task.entity';
import { Team } from '../../common/entities/team.entity';
import { UsersModule } from '../users/users.module';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Team]), UsersModule, TeamsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
