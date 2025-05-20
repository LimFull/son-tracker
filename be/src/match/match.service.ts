import { Injectable } from '@nestjs/common';
import { Match } from '../task/interface/crawlData.interface';
import Global from '../global/global';
import { crawlMatch } from '../utils/crawl';

@Injectable()
export class MatchService {
  async match(): Promise<Match[]> {
    const matchData = await Global.getData();

    if (!matchData || matchData.length === 0) {
      await crawlMatch();

      return await Global.getData();
    }

    return matchData as any;
  }
}
