import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';
import { TeamRole } from '../enums/team-role.enum';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.teamMemberships)
  user: User;

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;

  @Column({
    type: 'enum',
    enum: TeamRole,
    default: TeamRole.MEMBER,
  })
  role: TeamRole;

  @CreateDateColumn()
  joinedAt: Date;
}
