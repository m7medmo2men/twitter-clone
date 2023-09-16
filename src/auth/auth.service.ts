import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UserLogin } from './dto/UserLogin.dto';
import { UserRegistrationDto } from './dto/UserRegistration.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: UserLogin) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        likedPosts: true,
        Posts: true,
      },
    });

    console.log(loginDto['Email']);

    if (!user) throw new BadRequestException('Email/Password is incorrect');

    if (user.password !== loginDto.password)
      throw new BadRequestException('Email/Password is incorrect');

    return user;
  }

  async register(registerDto: UserRegistrationDto) {
    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: registerDto.password,
        username: registerDto.username,
      },
    });

    return user;
  }

  async logout(session: Record<string, any>) {
    session.destroy((err) => {
      if (err) throw new BadRequestException('Failed to logout');
    });
  }

  async userExists(email: string): Promise<Boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user ? true : false;
  }
}
