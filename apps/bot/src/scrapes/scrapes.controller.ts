import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard, NoCache, Serialize } from '@app/common';
import { ScrapesService } from './scrapes.service';
import { GetJobDto } from './dto/get-job.dto';

@ApiTags('Scrapes')
@NoCache()
@Controller('scrapes')
export class ScrapesController {
  constructor(private readonly scrapesService: ScrapesService) {}

  @Get('trigger/jobs/status')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetJobDto)
  @ApiOkResponse({
    type: GetJobDto,
  })
  async readJobStatus() {
    return this.scrapesService.readJobStatus();
  }

  @Post('trigger/jobs')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetJobDto)
  @ApiOkResponse({
    type: GetJobDto,
  })
  async triggerJob() {
    return this.scrapesService.triggerJob();
  }

  @Post('trigger/jobs/force/stop')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetJobDto)
  @ApiOkResponse({
    type: GetJobDto,
  })
  async forceStopJob() {
    return this.scrapesService.forceStopJob();
  }
}
