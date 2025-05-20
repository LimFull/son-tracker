import { Match } from '../task/interface/crawlData.interface';
import * as fs from 'node:fs';
import { winstonLogger } from '../utils/winston';

class Global {
  static matchData: Match[];

  getData = async () => {
    try {
      const buffer = await fs.promises.readFile('./result.json', 'utf-8');
      const result = JSON.parse(buffer);

      return result as Match[];
    } catch (e) {
      return [] as Match[];
    }
  };
}

export default new Global();
