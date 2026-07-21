import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, Min, Matches } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Wake time must be in HH:MM format' })
  wakeTime?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Sleep time must be in HH:MM format' })
  sleepTime?: string;

  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  @IsOptional()
  workDays?: number[];

  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  @IsOptional()
  schoolDays?: number[];

  @IsString()
  @IsOptional()
  preferredStudyTime?: string;

  @IsString()
  @IsOptional()
  preferredFocusTime?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  breakDuration?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  travelPadding?: number;

  @IsBoolean()
  @IsOptional()
  prayerTimesEnabled?: boolean;

  @IsString()
  @IsOptional()
  controlMode?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxTaskMovementWindow?: number;
}
