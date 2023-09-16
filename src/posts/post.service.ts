import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      include: {
        postedBy: true,
        likedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  }

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const post = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        userId,
      },
      include: {
        postedBy: true,
        likedBy: true,
      },
    });

    return post;
  }

  async likePost(postId: number, userId: number) {
    const post = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedBy: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        likedBy: true,
      },
    });
    return post;
  }

  async unlikePost(postId: number, userId: number) {
    const post = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedBy: {
          disconnect: {
            id: userId,
          },
        },
      },
      include: {
        likedBy: true,
      },
    });

    return post;
  }
}
