import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateStatusDto } from './application.dto';

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

  async getAppliedJobs(userId: any) {
    const applications = await this.prismaService.application.findMany({
      where: { applicantId: userId },
      orderBy: { createdAt: 'desc' },
      include: { job: { include: { company: true } } },
    });
    if (!applications || applications.length === 0) {
      throw new BadRequestException('No applications found');
    }
    return applications;
  }

  async getAppliedJobsByJobId(jobId: string, userId: any) {
    const applications = await this.prismaService.application.findMany({
      where: { jobId, applicantId: userId },
      orderBy: { createdAt: 'desc' },
      include: { job: { include: { company: true } } },
    });
    if (!applications || applications.length === 0) {
      throw new BadRequestException('No applications found');
    }
    return applications;
  }

  async updateApplicationStatus(
    applicationId: string,
    updateStatusDto: UpdateStatusDto,
  ) {
    const { status } = updateStatusDto;
    const application = await this.prismaService.application.findUnique({
      where: { id: applicationId },
    });
    if (!application) {
      throw new BadRequestException('Application not found');
    }
    const updatedApplication = await this.prismaService.application.update({
      where: { id: applicationId },
      data: { status: status?.toLowerCase() },
    });
    if (!updatedApplication) {
      throw new BadRequestException('Application not updated');
    }
    return updatedApplication;
  }
}
