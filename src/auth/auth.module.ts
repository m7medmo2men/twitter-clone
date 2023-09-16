import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppController } from 'src/app.controller';
import { AuthGuard } from './auth.gurd';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
