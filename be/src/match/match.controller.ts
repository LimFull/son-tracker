import { Controller, Get } from '@nestjs/common';
import { Match } from '../task/interface/crawlData.interface';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get()
  getMatch(): Promise<Match[]> {
    return this.matchService.match();
  }
}
