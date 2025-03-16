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

  async login(email: string, password: string, role: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('InCorrect password');
    }
    if (role && user.role !== role) {
      throw new BadRequestException('User role does not match');
    }
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { user, token };
  }

  async logout() {
    return { message: 'User logged out', success: true };
  }
}
