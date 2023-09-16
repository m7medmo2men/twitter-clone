import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Session,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.user.id;

    return this.postService.createPost(createPostDto, userId);
  }

  @Put('/:postId/like')
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.user.id;
    const postData = await this.postService.likePost(postId, userId);
    session.user.likedPosts.push(postData);
    return postData;
  }

  @Put('/:postId/unlike')
  unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.user.id;
    session.user.likedPosts = session.user.likedPosts.filter(
      (post) => post.id !== postId,
    );
    return this.postService.unlikePost(postId, userId);
  }
}