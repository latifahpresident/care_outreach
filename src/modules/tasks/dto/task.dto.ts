import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsEnum(['queued', 'in_progress', 'retry', 'completed'] as const)
  status: 'queued' | 'in_progress' | 'retry' | 'completed';

  @IsOptional()
  @IsInt()
  assigned_cc_id?: number;
}
