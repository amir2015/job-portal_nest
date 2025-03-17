import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerCompany(
    @Body() registerCompanyDto: RegisterCompanyDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const result = await this.companyService.registerCompany(
      registerCompanyDto,
      userId,
    );
    return {
      message: 'company registered successfully',
      result,
      success: true,
    };
  }
}
