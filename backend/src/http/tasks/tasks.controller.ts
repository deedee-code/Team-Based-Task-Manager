import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { TaskPermissionGuard } from '../../common/guards/task-permission.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../common/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('teams/:teamId/tasks')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(
    @Param('teamId') teamId: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.create(teamId, createTaskDto, user);
  }

  @Get()
  findByTeam(@Param('teamId') teamId: string) {
    return this.tasksService.findByTeam(teamId);
  }

  @Get(':taskId')
  findOne(@Param('taskId') taskId: string) {
    return this.tasksService.findById(taskId);
  }

  @Patch(':taskId')
  @UseGuards(TaskPermissionGuard)
  update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(TaskPermissionGuard)
  remove(@Param('taskId') taskId: string) {
    return this.tasksService.remove(taskId);
  }
}
