import { Injectable, Session } from '@nestjs/common';
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
        followers: {
          include: {
            following: true,
          }
        },
        following: {
          include: {
            follower: true,
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
          }
        }
      }, 
    }).then((user: any) => {
      user.followers = user.followers.map((follow) => {
        return follow.following;
      });

      user.following = user.following.map((follow) => {
        return follow.follower;
      });

      return user;
    })

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
        followers: {
          include: {
            following: true,
          }
        },
        following: {
          include: {
            follower: true,
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
          }
        }
      }, 
    }).then((user: any) => {
      user.followers = user.followers.map((follow) => {
        return follow.following;
      });

      user.following = user.following.map((follow) => {
        return follow.follower;
      });

      return user;
    })

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

  /**
   * When userId is following followedUser
   */
  async followUser(userId: number, followedUser: number) {
    return await this.prisma.follows.create({
      data: {
        followerId: followedUser,
        followingId: userId,
      },
    });
  }

  async unFollowUser(userId: number, followedUser: number) {
    return await this.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: followedUser,
          followingId: userId,
        },
      },
    });
  }

  // addIsFollowingProperty(user: any, @Session() session: Record<string, any>) {
  //   console.log(user);
  //   console.log(session);
  //   if (session) {
  //     user.isFollowing = user.followers.some((follower) => {
  //       return follower.id === session.user.id;
  //     });
  //   }
  // }
}
