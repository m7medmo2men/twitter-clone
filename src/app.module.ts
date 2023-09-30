import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './posts/post.module';
import { PrismaService } from './db/prisma.service';
import { UserController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UserService } from './users/users.service';

@Module({
  imports: [AuthModule, PostModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
