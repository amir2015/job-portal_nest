import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/userDto.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerUserDto: RegisterUserDto) {
    const {
      email,
      phoneNumber,
      password,
      profileBio,
      profilePhoto,
      profileResumeOriginalName,
      profileResume,
      profileSkills,
      fullname,
    } = registerUserDto;
    if (!email || !password || !phoneNumber) {
      throw new Error('Email, password, and phone number are required');
    }
    const userExisting = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExisting) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        phoneNumber,
        password: hashedPassword,
        profileBio,
        profilePhoto,
        profileResumeOriginalName,
        profileResume,
        profileSkills,
        fullname,
      },
    });
    if (!user) {
      throw new BadRequestException('User not created');
    }
    return { user, success: true, message: 'User successfully created' };
  }

  async login() {}
}
