import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
    CompanyModule,
    JobModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
