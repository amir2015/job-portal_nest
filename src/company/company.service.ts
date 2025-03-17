import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getCompanies(userId: any) {
    const companies = await this.prismaService.company.findMany({
      where: {
        userId,
      },
    });
    if (!companies || companies.length === 0) {
      throw new NotFoundException('no companies found');
    }
    return companies;
  }

  async getCompanyById(id: any) {
    const company = await this.prismaService.company.findUnique({
      where: {
        id,
      },
    });
    if (!company) {
      throw new NotFoundException('company not found');
    }
    return company;
  }

  async deleteCompany(id: any) {
    const company = await this.prismaService.company.delete({
      where: {
        id,
      },
    });
    if (!company) {
      throw new NotFoundException('company not found');
    }
    return {
      message: 'company deleted successfully',
      success: true,
    };
  }

  async updateCompany(id: any, updateCompanyDto: any) {
    const { name, description, website, location } = updateCompanyDto;
    // const company = await this.prismaService.company.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     name,
    //     description,
    //     website,
    //     location,
    //   },
    // });
    // if (!company) {
    //   throw new NotFoundException('company not found');
    // }
    // return company;

    const company = await this.prismaService.company.findUnique({
      where: {
        id,
      },
    });
    if (!company) {
      throw new NotFoundException('company not found');
    }
    const updatedCompany = {
      name: name || company.name,
      description: description || company.description,
      website: website || company.website,
      location: location || company.location,
    };
    await this.prismaService.company.update({
      where: {
        id,
      },
      data: updatedCompany,
    });
    return updatedCompany;
  }
}
