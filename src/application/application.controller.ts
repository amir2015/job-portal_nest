import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
}
