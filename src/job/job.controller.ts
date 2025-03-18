import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostJobDto } from './jobDto.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async postJob(@Body() postJobDto: PostJobDto, @Req() req: any) {
    const userId = req.user.id;
    const job = await this.jobService.postJob(postJobDto, userId);
    return {
      message: 'job posted successfully',
      result: job,
      success: true,
    };
  }

  @Get()
  async getAllJobs(@Query() query: string) {
    const jobs = await this.jobService.getAllJobs(query);
    return {
      message: 'jobs fetched successfully',
      result: jobs,
      success: true,
    };
  }

  @Get(':id')
  async getJobById(@Param('id') jobId: string) {
    const job = await this.jobService.getJobById(jobId);
    return {
      job,
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite/:id')
  async favoriteJob(@Param('id') jobId: string, @Req() req: any) {
    const userId = req.user.id;
    const result = await this.jobService.favoriteJob(jobId, userId);
    return {
      message: 'job added in favorites successfully',
      result,
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Req() req: any) {
    const userId = req.user.id;
    const result = await this.jobService.getFavorites(userId);
    return {
      message: 'favorites fetched successfully',
      result,
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/jobs')
  async getJobByUserId(@Req() req: any) {
    const userId = req.user.id;
    const jobs = await this.jobService.getJobByUserId(userId);
    return { jobs, success: true };
  }
}
