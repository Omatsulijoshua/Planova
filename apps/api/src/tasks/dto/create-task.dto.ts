import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTaskTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDateString({}, { message: 'Invalid due date' })
  @IsOptional()
  dueDate?: string;

  @IsInt()
  @Min(1, { message: 'Duration must be positive' })
  duration!: number; // maps to estimatedMin

  @IsEnum(TaskPriority, { message: 'Invalid priority' })
  priority!: TaskPriority;

  @IsArray()
  @IsUUID('4', { each: true, message: 'Invalid dependency ID' })
  @IsOptional()
  dependencies?: string[];
}
