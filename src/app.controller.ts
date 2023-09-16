import { Get, Controller, Render, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.gurd';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  @Render('login')
  renderLoginPage() {
    return {};
  }

  @Get('register')
  @Render('register')
  renderRegisterPage() {
    return {};
  }

  @Get()
  @Render('home')
  @UseGuards(AuthGuard)
  root(@Req() req) {
    return {
      pageTitle: 'Home',
      userLoggedIn: req.session.user,
      userLoggedInJs: JSON.stringify(req.session.user),
    };
  }
}
