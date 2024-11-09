import { Match } from '../task/interface/crawlData.interface';
import { MatchService } from './match.service';
export declare class MatchController {
    private matchService;
    constructor(matchService: MatchService);
    getMatch(): Promise<Match[]>;
}
