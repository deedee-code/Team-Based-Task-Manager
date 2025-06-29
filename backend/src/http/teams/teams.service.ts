import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../common/entities/team.entity';
import { TeamMember } from '../../common/entities/team-member.entity';
import { User } from '../../common/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { TeamRole } from '../../common/enums/team-role.enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMembersRepository: Repository<TeamMember>,
    private usersService: UsersService,
  ) {}

  async create(createTeamDto: CreateTeamDto, user: User): Promise<Team> {
    const team = this.teamsRepository.create({
      ...createTeamDto,
      createdBy: user,
    });

    const savedTeam = await this.teamsRepository.save(team);

    // Add creator as admin
    const teamMember = this.teamMembersRepository.create({
      user,
      team: savedTeam,
      role: TeamRole.ADMIN,
    });

    await this.teamMembersRepository.save(teamMember);

    const foundTeam = await this.teamsRepository.findOne({
      where: { id: savedTeam.id },
      relations: ['members', 'members.user', 'createdBy'],
    });

    if (!foundTeam) {
      throw new NotFoundException('Team not found after creation');
    }

    return foundTeam;
  }

  async findUserTeams(userId: string): Promise<Team[]> {
    const teamMembers = await this.teamMembersRepository.find({
      where: { user: { id: userId } },
      relations: [
        'team',
        'team.createdBy',
        'team.members',
        'team.members.user',
      ],
    });

    return teamMembers.map((tm) => tm.team);
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'createdBy'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async inviteMember(
    teamId: string,
    inviteMemberDto: InviteMemberDto,
    adminUser: User,
  ): Promise<TeamMember> {
    const team = await this.findById(teamId);

    // Find user to invite
    const userToInvite = await this.usersService.findByUsernameOrEmail(
      inviteMemberDto.identifier,
    );
    if (!userToInvite) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const existingMember = await this.teamMembersRepository.findOne({
      where: { user: { id: userToInvite.id }, team: { id: teamId } },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this team');
    }

    const teamMember = this.teamMembersRepository.create({
      user: userToInvite,
      team,
      role: TeamRole.MEMBER,
    });

    return this.teamMembersRepository.save(teamMember);
  }

  async removeMember(
    teamId: string,
    memberId: string,
    adminUser: User,
  ): Promise<void> {
    const teamMember = await this.teamMembersRepository.findOne({
      where: { id: memberId, team: { id: teamId } },
      relations: ['user', 'team'],
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    // Prevent removing the team creator
    const team = await this.findById(teamId);
    if (teamMember.user.id === team.createdBy.id) {
      throw new ForbiddenException('Cannot remove the team creator');
    }

    await this.teamMembersRepository.remove(teamMember);
  }

  async isUserMemberOfTeam(userId: string, teamId: string): Promise<boolean> {
    const teamMember = await this.teamMembersRepository.findOne({
      where: { user: { id: userId }, team: { id: teamId } },
    });

    return !!teamMember;
  }

  async isUserAdminOfTeam(userId: string, teamId: string): Promise<boolean> {
    const teamMember = await this.teamMembersRepository.findOne({
      where: {
        user: { id: userId },
        team: { id: teamId },
        role: TeamRole.ADMIN,
      },
    });

    return !!teamMember;
  }

  async getUserRoleInTeam(
    userId: string,
    teamId: string,
  ): Promise<TeamRole | null> {
    const teamMember = await this.teamMembersRepository.findOne({
      where: { user: { id: userId }, team: { id: teamId } },
    });

    return teamMember?.role || null;
  }
}
