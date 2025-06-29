import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './http/auth/auth.module';
import { UsersModule } from './http/users/users.module';
import { TeamsModule } from './http/teams/teams.module';
import { TasksModule } from './http/tasks/tasks.module';
import { DatabaseProviderModule } from './database/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    DatabaseProviderModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
