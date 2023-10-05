import { Controller, Get, Param, ParseIntPipe, Post, Req, Session, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
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

  @Post('/profilePicture')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("croppedImage", {
    storage: diskStorage({
      destination: "./uploads",
    })
  }))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File,
  //  @Req() req) {
   @Session() session: Record<string, any>) {
    

    const filename = `${session.user.username} - ${Date.now()}.png`;
    const targetPath = `public/uploads/${filename}`;
    const savedFilePath = `/uploads/${filename}`;
    
    fs.renameSync(file.path, targetPath);
    await this.userService.updateUser(session.user.id, { profilePicture: savedFilePath });
    
    session.user.profilePicture = savedFilePath;

    return;
  }
}