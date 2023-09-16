import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  Session,
  UsePipes,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/UserRegistration.dto';
import { AppController } from 'src/app.controller';
import { UserLogin } from './dto/UserLogin.dto';

@Controller('auth')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: UserLogin,
    @Session() session: Record<string, any>,
    @Res() response: any,
  ) {
    const user = await this.authService.login(loginDto);
    session.user = user;

    // Redirect to the home page
    response.redirect('/');
  }

  @Get('logout')
  async logout(@Session() session: Record<string, any>, @Res() response: any) {
    await this.authService.logout(session);
    response.redirect('/login');
  }

  @Post('register')
  async register(
    @Body() registerDto: UserRegistrationDto,
    @Res() response: any,
  ) {
    if (await this.authService.userExists(registerDto.email)) {
      console.log('User already exists');
      // throw new BadRequestException('User already exists');
      response.redirect('/register');
    }

    const user = this.authService.register(registerDto);
    response.redirect('/login');
    // return user;
  }
}
