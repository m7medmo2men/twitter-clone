import { IsNotEmpty, IsString } from 'class-validator';

export class UserLogin {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
