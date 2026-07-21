import { IsString, IsIn, IsOptional } from 'class-validator';

export class SubscribeDto {
  @IsString()
  @IsIn(['free', 'student', 'pro'], { message: 'Plan code must be free, student, or pro' })
  planCode!: string;

  @IsString()
  @IsOptional()
  paymentGateway?: string;
}
