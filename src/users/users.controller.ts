import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller('/api/users')
export class UserController {

  constructor(private userService: UserService) {}

  @Get('/profile/:id')
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.getUser(id);
  }
}