import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { TeamAdminGuard } from '../../common/guards/team-admin.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../common/entities/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @GetUser() user: User) {
    return this.teamsService.create(createTeamDto, user);
  }

  @Get()
  findUserTeams(@GetUser() user: User) {
    return this.teamsService.findUserTeams(user.id);
  }

  @Get(':teamId')
  @UseGuards(TeamMemberGuard)
  findOne(@Param('teamId') teamId: string) {
    return this.teamsService.findById(teamId);
  }

  @Post(':teamId/members')
  @UseGuards(TeamAdminGuard)
  inviteMember(
    @Param('teamId') teamId: string,
    @Body() inviteMemberDto: InviteMemberDto,
    @GetUser() user: User,
  ) {
    return this.teamsService.inviteMember(teamId, inviteMemberDto, user);
  }

  @Delete(':teamId/members/:memberId')
  @UseGuards(TeamAdminGuard)
  removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @GetUser() user: User,
  ) {
    return this.teamsService.removeMember(teamId, memberId, user);
  }
}
