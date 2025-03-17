import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}
  async registerCompany(registerCompanyDto: any, userId: any) {
    const { name, description, website, location, logo } = registerCompanyDto;
    const companyExisting = await this.prismaService.company.findUnique({
      where: {
        name,
      },
    });
    if (companyExisting) {
      return {
        error: 'Company already exists',
      };
    }
    const company = await this.prismaService.company.create({
      data: {
        name,
        description,
        website,
        location,
        logo,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return company;
  }
}
