import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { winstonLogger } from './winston';
import { LINKS } from '../constants/links';

import { Global } from 'src/global/global';
import { Match } from '../task/interface/crawlData.interface';

const flag = false;

export const crawlMatch = async () => {
  let browser: Browser;
  let page: Page;

  try {
    browser = await puppeteer.launch({
      headless: false,
      timeout: 30000,
    });

    page = await browser.newPage();
    await page.goto(LINKS.SON);
    const content = await page.content();

    const $ = cheerio.load(content);

    // return {} as any;
    const fixtureItmes = $('.timeline_box');
    const matchData: Match[] = [];
    fixtureItmes.map((i, v) => {
      const content = $(v);

      const date = content.find('.cm_date').text();
      const time = content.find('dt.blind:nth-of-type(1) + dd').text();
      const state = content
        .find('.match_round > .state_mark:first-of-type')
        .text();
      const mark = content
        .find('.match_round > .state_mark:nth-of-type(2)')
        .text();
      const homeTeamName = content
        .find('.match_list > li:nth-of-type(1) > .team_name')
        .text();
      const awayTeamName = content
        .find('.match_list > li:nth-of-type(2) > .team_name')
        .text();
      const homeScore = content
        .find('.match_list > li:nth-of-type(1) > .team_score')
        .text();
      const awayScore = content
        .find('.match_list > li:nth-of-type(2) > .team_score')
        .text();
      const logos = [];
      content
        .find('.team_thumb')
        .find('img')
        .map((i, v) => logos.push($(v).attr('src')));
      const location = content.find('.stadium').text();

      matchData.push({
        kickoff: {
          week: date ?? null,
          date: time ?? null,
          state: state ?? null,
          mark: mark ?? null,
          detailUrl: null,
        },
        crests: {
          logos: logos ?? null,
          names: [homeTeamName, awayTeamName],
          scores:
            homeScore && awayScore ? `${homeScore} vs ${awayScore}` : 'vs',
        },
        stadium: {
          location: location ?? null,
        },
      });
    });

    Global.matchData = matchData;

    winstonLogger.log('close page');
    await page.close();
    winstonLogger.log('close browser');
    await browser.close();
  } catch (e) {
    winstonLogger.error(e);
  } finally {
  }
};
