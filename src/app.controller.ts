import { Get, Controller, Render, Req, UseGuards, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.gurd';
import { UserService } from './users/users.service';

@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService,
              private readonly userService: UserService) {}

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

  @Get('posts/:id')
  @Render('post')
  @UseGuards(AuthGuard)
  renderPostPage(@Req() req) {
    return {
      pageTitle: 'View Post',
      userLoggedIn: req.session.user,
      userLoggedInJs: JSON.stringify(req.session.user),
      postId: req.params.id,
    };
  }

  @Get('profile/:username')
  @Render('profile')
  async renderProfilePage(@Req() req, @Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      return {
        // pageTitle: 'Profile Page',
        pageTitle: user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUserId: user.id,
        user: user,
      };
    } else {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        user: user,
      };
    }
  }
  
  @Get('profile/:username/replies')
  @Render('profile')
  async renderProfilePageWithReplies(@Req() req, @Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      return {
        pageTitle: user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUserId: user.id,
        user: user,
        selectedTab: 'replies',
      };
    } else {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        user: user,
      };
    }
  }
  
  @Get('profile/:username/following')
  @Render('followingNfollowers')
  async renderFollowingPage(@Req() req, @Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      return {
        pageTitle: user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUserId: user.id,
        user: user,
        // userJs: JSON.stringify(user),
        selectedTab: 'following',
      };
    } else {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        user: user,
      };
    }
  }
  
  @Get('profile/:username/followers')
  @Render('followingNfollowers')
  async renderFollowersPage(@Req() req, @Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      return {
        pageTitle: user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUserId: user.id,
        user: user,
        // userJs: JSON.stringify(user),
        selectedTab: 'followers',
      };
    } else {
      return {
        pageTitle: 'User Not Found',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        user: user,
      };
    }
  }

  @Get('profile')
  @Render('profile')
  @UseGuards(AuthGuard)
  renderUserProfilePage(@Req() req) {
    return {
      pageTitle: req.session.user.username,
      userLoggedIn: req.session.user,
      userLoggedInJs: JSON.stringify(req.session.user),
      profileUserId: req.session.user.id,
      user: req.session.user,
    };
  }
}
