import { Injectable } from '@nestjs/common';
import { Match } from '../task/interface/crawlData.interface';
import Global from '../global/global';
import { crawlMatch } from '../utils/crawl';
import { winstonLogger } from '../utils/winston';

@Injectable()
export class MatchService {
  async match(): Promise<Match[]> {
    const matchData = await Global.getData();

    if (!matchData) {
      winstonLogger.log('no matchData. begin crawl');
      await crawlMatch();
      winstonLogger.log('crawl success');
    }

    return matchData as any;
  }
}
