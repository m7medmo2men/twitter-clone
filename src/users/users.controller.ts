import { Controller, Get, Param, ParseIntPipe, Post, Put, Req, Session, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from "fs";
import { AuthGuard } from "src/auth/auth.gurd";

@Controller('/api/users')
export class UserController {

  constructor(private userService: UserService) {}

  @Get('/profile/:id')
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ) { 
    return this.userService.getUser(id);
  }

  @Put('/:userId/follow/:followedUserId')
  @UseGuards(AuthGuard)
  async followUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('followedUserId', ParseIntPipe) followedUserId: number,
    @Session() session: Record<string, any>,
  ) {
    await this.userService.followUser(userId, followedUserId);
    session.user = await this.userService.getUser(userId);
    return;
  }
  
  @Put('/:userId/unFollow/:followedUserId')
  @UseGuards(AuthGuard)
  async unFollowUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('followedUserId', ParseIntPipe) followedUserId: number,
    @Session() session: Record<string, any>,
  ) {
    await this.userService.unFollowUser(userId, followedUserId);
    session.user = await this.userService.getUser(userId);
    return; 
  }

  @Post('/profilePicture')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("croppedImage", {
    storage: diskStorage({
      destination: "./uploads",
    })
  }))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File,
   @Session() session: Record<string, any>) {
    

    const filename = `${session.user.username} - profile picture - ${Date.now()}.png`;
    const targetPath = `public/uploads/${filename}`;
    const savedFilePath = `/uploads/${filename}`;
    
    fs.renameSync(file.path, targetPath);
    await this.userService.updateUser(session.user.id, { profilePicture: savedFilePath });
    
    session.user.profilePicture = savedFilePath;

    return;
  }
  
  @Post('/coverPicture')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("croppedImage", {
    storage: diskStorage({
      destination: "./uploads",
    })
  }))
  async uploadCoverPicture(@UploadedFile() file: Express.Multer.File,
   @Session() session: Record<string, any>) {
    

    const filename = `${session.user.username} - cover picture  - ${Date.now()}.png`;
    const targetPath = `public/uploads/${filename}`;
    const savedFilePath = `/uploads/${filename}`;
    
    fs.renameSync(file.path, targetPath);
    await this.userService.updateUser(session.user.id, { coverPicture: savedFilePath });
    
    session.user.coverPicture = savedFilePath;

    return;
  }
}