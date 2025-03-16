import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/userDto.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const { email, password, role } = body;
    try {
      const userResponse = await this.userService.login(email, password, role);
      res.cookie('token', userResponse?.token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res.status(200).json(userResponse);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    try {
      const result = await this.userService.logout();

      res.cookie('token', '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message, success: false });
    }
  }
}
