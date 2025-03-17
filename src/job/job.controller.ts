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
}
