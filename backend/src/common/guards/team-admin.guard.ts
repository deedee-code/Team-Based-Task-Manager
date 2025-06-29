import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TeamsService } from '../../http/teams/teams.service';

@Injectable()
export class TeamAdminGuard implements CanActivate {
  constructor(private teamsService: TeamsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const teamId = request.params.teamId;

    if (!teamId) {
      throw new ForbiddenException('Team ID is required');
    }

    const isAdmin = await this.teamsService.isUserAdminOfTeam(user.id, teamId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'You must be an admin of this team to perform this action',
      );
    }

    return true;
  }
}
