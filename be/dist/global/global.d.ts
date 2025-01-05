import { Match } from '../task/interface/crawlData.interface';
declare class Global {
    static matchData: Match[];
    getData: () => Promise<Match[]>;
}
declare const _default: Global;
export default _default;
