import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import * as cheerio from 'cheerio';
import { winstonLogger } from './winston';
import { LINKS } from '../constants/links';

import { Match } from '../task/interface/crawlData.interface';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'node:fs';

export const crawlMatch = async () => {
  let browser: Browser;
  let page: Page;

  try {
    browser = await puppeteer.use(StealthPlugin()).launch({
      headless: true,
      timeout: 30000,
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
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

    fs.writeFile(
      './result.json',
      JSON.stringify(matchData),
      'utf8',
      (err: any) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File Saved');
        }
      },
    );
  } catch (e) {
    winstonLogger.error(e);
  } finally {
    try {
      winstonLogger.log('close page');
      await page.close();
      winstonLogger.log('close browser');
      await browser.close();
    } catch (e: any) {
      winstonLogger.log('finally에서 에러났습니다', e);
    }
  }
};
