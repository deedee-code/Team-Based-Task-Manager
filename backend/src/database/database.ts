import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import { User } from '../common/entities/user.entity';
import { Team } from '../common/entities/team.entity';
import { TeamMember } from '../common/entities/team-member.entity';
import { Task } from '../common/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: config.get('database.type'),
        database: config.get('database.database'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        host: config.get('database.host'),
        port: config.get('database.port'),
        synchronize: true,
        entities: [User, Team, TeamMember, Task],
      }),
      inject: [ConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class DatabaseProviderModule {}
