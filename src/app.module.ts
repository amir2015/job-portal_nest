import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [ConfigModule, UserModule, CompanyModule, JobModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,UserService],
})
export class AppModule {}
