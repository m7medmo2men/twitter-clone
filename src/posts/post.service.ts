import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Filter } from 'src/types/Filter';
import { Post } from './types/post.type';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      include: {
        postedBy: true,
        likedBy: true,
        retweetedBy: true,
        originalTweet: {
          include: {
            postedBy: true,
            likedBy: true,
            retweetedBy: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  }

  async getPosts(filter: Filter<Post>) {
    const { where } = filter;
    const posts = await this.prisma.post.findMany({
      where,
      include: {
        postedBy: true,
        likedBy: true,
        retweetedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  }

  async getPost(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        postedBy: true,
        likedBy: true,
        retweets: true,
        retweetedBy: true,
      },
    });

    return post;
  }

  async createPost(createPostDto: CreatePostDto, userId: number) {
    // const retweetedBy = retweet
    //   ? {
    //       connect: {
    //         id: userId,
    //       },
    //     }
    //   : undefined;

    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
        // retweetedBy, // Will Have Value only if you are retweeting.
      },
      include: {
        postedBy: true,
        likedBy: true,
        retweetedBy: true,
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

  async retweetPost(postId: number, userId: number) {
    const retweet = await this.prisma.post.findMany({
      where: {
        userId: userId,
        parentTweetId: postId,
      },
    });

    // console.log(retweet);
    const isRetweetedPreviously = retweet.length > 0 ? true : false;
    // console.log(isRetweetedPreviously);

    if (isRetweetedPreviously) {
      console.log('deleting');
      const oldPost = await this.deletePost(retweet[0].id);

      const updatedPost = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          retweetedBy: {
            disconnect: {
              id: userId,
            },
          },
        },
        include: {
          retweetedBy: true,
          postedBy: true,
          likedBy: true,
        },
      });

      return updatedPost;
    } else {
      console.log('creating');

      let post = await this.getPost(postId);

      const retweet = await this.prisma.post.create({
        data: {
          content: post.content,
          userId,
          parentTweetId: postId,
        },
        include: {
          postedBy: true,
          likedBy: true,
          retweetedBy: true,
        },
      });

      let updatedPost = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          retweetedBy: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          retweetedBy: true,
          postedBy: true,
          likedBy: true,
        },
      });

      return updatedPost;
      return {
        updatedPost,
        retweet,
      };
    }
  }

  async deletePost(postId: number) {
    const post = await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return post;
  }
}
