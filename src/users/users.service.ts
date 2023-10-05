import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Posts: true,
        likedPosts: true,
        retweetedPosts: true,
      }, 
    });

    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username
      },
      include: {
        Posts: true,
        likedPosts: true,
        retweetedPosts: true,
      }, 
    });

    return user;
  }

  async updateUser(userId: number, data: any) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });

    return user;
  }
}
