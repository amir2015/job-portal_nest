import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private prismaService: PrismaService) {}

  async applyJob(jobId: string, applicantid: any) {
    if (!jobId) {
      throw new BadRequestException('jobId is required');
    }
    const existingApplication = await this.prismaService.application.findFirst({
      where: { jobId, applicantId: applicantid },
    });
    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }
    const job = await this.prismaService.job.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      throw new BadRequestException('Job not found');
    }
    const newApplication = await this.prismaService.application.create({
      data: {
        jobId,
        applicantId: applicantid,
      },
    });
    if (!newApplication) {
      throw new BadRequestException('Application not created');
    }
    return newApplication;
  }
}
