import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateStatusDto } from './application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async applyJob(@Param('id') jobId: string, @Req() req: any) {
    const applicantId = req.user.id;
    const application = await this.applicationService.applyJob(
      jobId,
      applicantId,
    );
    return {
      message: 'your application has been submitted',
      application,
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAppliedJobs(@Req() req: any) {
    const userId = req.user.id;
    const result = await this.applicationService.getAppliedJobs(userId);
    return {
      message: 'applied jobs fetched successfully',
      result,
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAppliedJobsByJobId(@Param('id') jobId: string, @Req() req: any) {
    const userId = req.user.id;
    const result = await this.applicationService.getAppliedJobsByJobId(
      jobId,
      userId,
    );
    return {
      message: 'applied jobs fetched successfully',
      result,
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-status/:id')
  async updateApplicationStatus(
    @Param('id') applicationId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const result = await this.applicationService.updateApplicationStatus(
      applicationId,
      updateStatusDto,
    );
    return {
      message: 'application status updated successfully',
      result,
      success: true,
    };
  }
}
