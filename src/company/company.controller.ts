import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCompanies(@Req() req: any) {
    const userId = req.user.id;
    const result = await this.companyService.getCompanies(userId);
    return {
      message: 'companies fetched successfully',
      result,
      success: true,
    };
  }

  @Get(':id')
  async getCompanyById(@Param('id') companyId: string) {
    const company = await this.companyService.getCompanyById(companyId);
    return {
      message: 'company found',
      result: company,
      success: true,
    };
  }

  @Delete(':id')
  async deleteCompany(@Param('id') companyId: string) {
    const result = await this.companyService.deleteCompany(companyId);
    return {
      message: 'company deleted successfully',
      result,
      success: true,
    };
  }

  @Put(':id')
  async updateCompany(
    @Param('id') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const result = await this.companyService.updateCompany(
      companyId,
      updateCompanyDto,
    );
    return {
      message: 'company updated successfully',
      result,
      success: true,
    };
  }
}
