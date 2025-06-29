import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
