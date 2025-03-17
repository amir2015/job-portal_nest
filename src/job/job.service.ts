import { BadRequestException, Injectable } from '@nestjs/common';
import { PostJobDto } from './jobDto.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JobService {
  constructor(private prismaService: PrismaService) {}
  async postJob(postJobDto: PostJobDto, createdById: string) {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
    } = postJobDto;
    const job = await this.prismaService.job.create({
      data: {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experienceLevel,
        position,
        companyId,
        createdById,
      },
      include: { company: true },
    });
    if (!job) {
      throw new BadRequestException('Job Not created');
    }
    return job;
  }

  async getAllJobs(query: any) {
    const { location, salary, jobType, keyword } = query;
    const salaryRange = salary?.split('-');
    let jobs = [];
    if (location || salary || jobType || keyword) {
      jobs = await this.prismaService.job.findMany({
        where: {
          ...(keyword && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ],
          }),
          ...(location && {
            location: { contains: location, mode: 'insensitive' },
          }),
          ...(jobType && {
            jobType: { contains: jobType, mode: 'insensitive' },
          }),
          ...(salary &&
            salaryRange?.length && {
              salary: {
                gte: parseInt(salaryRange[0], 10),
                lte: parseInt(salaryRange[1], 10),
              },
            }),
        },
        include: { company: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      jobs = await this.prismaService.job.findMany({
        skip: 0,
        take: 5,
      });
    }
    if (!jobs || jobs.length === 0) {
      throw new BadRequestException('No jobs found');
    }
    return jobs;
  }
}
