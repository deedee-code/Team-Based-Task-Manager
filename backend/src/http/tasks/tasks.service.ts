import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../common/entities/task.entity';
import { Team } from '../../common/entities/team.entity';
import { User } from '../../common/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private usersService: UsersService,
    private teamsService: TeamsService,
  ) {}

  async create(
    teamId: string,
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const team = await this.teamsRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    let assignedTo: User | null = null;
    if (createTaskDto.assignedToId) {
      assignedTo = await this.usersService.findById(createTaskDto.assignedToId);
      if (!assignedTo) {
        throw new NotFoundException('Assigned user not found');
      }

      // Check if assigned user is a member of the team
      const isMember = await this.teamsService.isUserMemberOfTeam(
        assignedTo.id,
        teamId,
      );
      if (!isMember) {
        throw new ForbiddenException(
          'Cannot assign task to user who is not a member of this team',
        );
      }
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      team,
      createdBy: user,
      assignedTo: assignedTo === null ? undefined : assignedTo,
    });

    return this.tasksRepository.save(task);
  }

  async findByTeam(teamId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { team: { id: teamId } },
      relations: ['createdBy', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['team', 'createdBy', 'assignedTo'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findById(id);

    let assignedTo: User | null = task.assignedTo || null;
    if (updateTaskDto.assignedToId !== undefined) {
      if (updateTaskDto.assignedToId === null) {
        assignedTo = null;
      } else {
        const foundUser = await this.usersService.findById(
          updateTaskDto.assignedToId,
        );
        if (!foundUser) {
          throw new NotFoundException('Assigned user not found');
        }

        // Check if assigned user is a member of the team
        const isMember = await this.teamsService.isUserMemberOfTeam(
          foundUser.id,
          task.team.id,
        );
        if (!isMember) {
          throw new ForbiddenException(
            'Cannot assign task to user who is not a member of this team',
          );
        }
        assignedTo = foundUser;
      }
    }

    Object.assign(task, updateTaskDto);
    task.assignedTo = assignedTo;

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findById(id);
    await this.tasksRepository.remove(task);
  }
}
