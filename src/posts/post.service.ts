import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Filter } from 'src/types/Filter';
import {
  Post,
  PostDto,
  PostFilterInput,
  PostInfo,
  User,
} from './types/post.type';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  private tweetStats = {
    _count: {
      select: {
        likedBy: true,
        retweetedBy: true,
        retweets: true,
        replys: true,
      },
    },
  };

  private populateWithPost = {
    include: {
      postedBy: true,
      likedBy: true,
      retweetedBy: true,
      ...this.tweetStats,
    },
  };

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
        replyedFrom: {
          include: {
            postedBy: true,
            likedBy: true,
            retweetedBy: true,
            replyedFrom: {
              include: {
                postedBy: true,
                likedBy: true,
                retweetedBy: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }

  async getAllPostsV2(filter: Filter<PostFilterInput>, userId: number = -1) {

    const { where } = filter;
    const { tweetType, ...rest } = where;

    let type = (tweetType === 'reply') ? { not: null } : (tweetType === 'tweet') ? null : rest.replyToId;
    
    let posts: PostInfo[] = await this.prisma.post.findMany({
      where: {
        ...rest,
        replyToId: type,
      },
      include: {
        postedBy: true,
        replyedFrom: {
          ...this.populateWithPost,
        },
        originalTweet: {
          ...this.populateWithPost,
        },
        likedBy: true,
        retweetedBy: true,
        ...this.tweetStats,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }).then((posts: any) => {
      return posts.map((post: PostInfo) => {
        post = this.markLikedAndRetweetedPosts(post, userId);
        if (post.replyedFrom) {
          post.replyedFrom = this.markLikedAndRetweetedPosts(
            post.replyedFrom,
            userId,
          );
        } else if (post.originalTweet) {
          post.originalTweet = this.markLikedAndRetweetedPosts(
            post.originalTweet,
            userId,
          );
        }

        return post;
      });
    });

    return posts;
  }

  markLikedAndRetweetedPosts(post: any, userId: number) {
    
    let isLiked = post.likedBy.some((user: User) => user.id === userId);
    let isRetweeted = post.retweetedBy.some((user: User) => user.id === userId);
    delete post.likedBy;
    delete post.retweetedBy;
    return {
      ...post,
      isLiked,
      isRetweeted,
    };
  }

  async getPost(postId: number, userId: number = -1) {
    let post = await this.getAllPostsV2({
      where: {
        id: postId,
      },
    }, userId);

    let foundPost = post[0];

    let replies = await this.getAllPostsV2({
      where: {
        replyToId: postId,
      }
    })

    // @ts-ignore
    foundPost.replies = replies;

    return foundPost;

  }

  async createPost(createPostDto: CreatePostDto, userId: number) {

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
        ...this.tweetStats,
      },
    });

    return post;
  }

  

  async retweetPost(postId: number, userId: number) {
    // console.log(postId, userId)
    // Check if the user has already retweeted the post.
    const retweet = await this.prisma.post.findMany({
      where: {
        userId: userId, // Tweet Posted By User
        parentTweetId: postId, // The Source Tweet [Means Retweeting]
      },
    });

    // console.log(retweet);
    const isRetweetedPreviously = retweet.length > 0 ? true : false;
    // console.log(isRetweetedPreviously);

    if (isRetweetedPreviously) {
      console.log('UnRetweeting');

      const retweetedPost = await this.deletePost(retweet[0].id);
      let postWithoutRetweet = await this.removeRetweet(postId, userId);

      return postWithoutRetweet;
    } else {
      console.log("Retweeting");

      let post: any = await this.getPost(postId);
      
      const retweet = await this.createPost({
        content: post.content,
        parentTweetId: postId,
      }, userId);

      const postAfterRetweet = await this.addRetweet(postId, userId);

      return postAfterRetweet;
    }
  }

  

  async deletePost(postId: number) {
    const post = await this.prisma.post.delete({
      where: { id: postId },
    });

    return post;
  }

  async replyToPost(
    postId: number,
    userId: number,
    createPostDto: CreatePostDto,
  ) {

    const replyPost = await this.createPost(createPostDto, userId);
    return replyPost;
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

  async addRetweet(postId: number, userId: number) {
    let postAfterRetweet = await this.prisma.post.update({
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
    return postAfterRetweet;
  }
  
  async removeRetweet(postId: number, userId: number) {
    let postWithoutRetweet = await this.prisma.post.update({
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
    return postWithoutRetweet;
  }
}
