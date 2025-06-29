import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from '../../http/tasks/tasks.service';
import { TeamsService } from '../../http/teams/teams.service';
import { TeamRole } from '../../common/enums/team-role.enum';

@Injectable()
export class TaskPermissionGuard implements CanActivate {
  constructor(
    private tasksService: TasksService,
    private teamsService: TeamsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const taskId = request.params.taskId;
    const teamId = request.params.teamId;

    if (!taskId || !teamId) {
      throw new ForbiddenException('Task ID and Team ID are required');
    }

    const task = await this.tasksService.findById(taskId);
    const userRole = await this.teamsService.getUserRoleInTeam(user.id, teamId);

    // Admin can edit any task
    if (userRole === TeamRole.ADMIN) {
      return true;
    }

    // Members can only edit tasks they created or are assigned to
    if (
      task.createdBy.id === user.id ||
      (task.assignedTo && task.assignedTo.id === user.id)
    ) {
      return true;
    }

    throw new ForbiddenException(
      'You can only edit tasks you created or are assigned to',
    );
  }
}
