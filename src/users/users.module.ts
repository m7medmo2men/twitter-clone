import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [],
})
export class UsersModule {}
