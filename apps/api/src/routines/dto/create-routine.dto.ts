import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, Matches } from 'class-validator';

export enum RoutineCategory {
  WORK = 'WORK',
  STUDY = 'STUDY',
  PERSONAL = 'PERSONAL',
  EXERCISE = 'EXERCISE',
  CUSTOM = 'CUSTOM',
}

export enum RoutinePriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum RoutineFlexibility {
  FLEXIBLE = 'FLEXIBLE',
  FIXED = 'FIXED',
}

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsEnum(RoutineCategory, { message: 'Invalid category' })
  category!: RoutineCategory;

  @IsInt()
  @Min(1, { message: 'Duration must be positive' })
  duration!: number;

  @IsEnum(RoutinePriority, { message: 'Invalid priority' })
  priority!: RoutinePriority;

  @IsEnum(RoutineFlexibility, { message: 'Invalid flexibility' })
  flexibility!: RoutineFlexibility;

  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  @IsOptional()
  daysOfWeek?: number[];

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time of day must be in HH:MM format' })
  timeOfDay?: string;
}
