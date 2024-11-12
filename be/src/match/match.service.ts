import { Injectable } from '@nestjs/common';
import { Match } from '../task/interface/crawlData.interface';
import { Global } from '../global/global';
import { crawlMatch } from '../utils/crawl';

@Injectable()
export class MatchService {
  async match(): Promise<Match[]> {
    if (!Global.matchData) {
      console.log('no matchData. begin crawl');
      await crawlMatch();
      console.log('crawl success');
    }

    return Global.matchData;
  }
}
