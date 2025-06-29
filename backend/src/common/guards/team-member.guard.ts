import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TeamsService } from '../../http/teams/teams.service';

@Injectable()
export class TeamMemberGuard implements CanActivate {
  constructor(private teamsService: TeamsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const teamId = request.params.teamId;

    if (!teamId) {
      throw new ForbiddenException('Team ID is required');
    }

    const isMember = await this.teamsService.isUserMemberOfTeam(
      user.id,
      teamId,
    );
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    return true;
  }
}
