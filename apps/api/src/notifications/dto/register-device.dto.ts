import { IsOptional, IsString, IsIn } from 'class-validator';

export class RegisterDeviceDto {
  @IsString({ message: 'FCM Token must be a string' })
  fcmToken!: string;

  @IsString()
  @IsIn(['android', 'ios', 'web'], { message: 'Platform must be android, ios, or web' })
  platform!: string;

  @IsString()
  @IsOptional()
  appVersion?: string;
}
