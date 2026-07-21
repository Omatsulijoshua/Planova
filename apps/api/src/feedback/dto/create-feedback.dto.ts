import { IsInt, IsNotEmpty, IsString, Min, Max, IsIn } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  rating!: number;

  @IsString()
  @IsNotEmpty({ message: 'Comment is required' })
  comment!: string;

  @IsString()
  @IsIn(['TIMETABLE_QUALITY', 'BUG_REPORT', 'FEATURE_REQUEST'], {
    message: 'Type must be TIMETABLE_QUALITY, BUG_REPORT, or FEATURE_REQUEST',
  })
  type!: string;
}
