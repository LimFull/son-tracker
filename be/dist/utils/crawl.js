"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlMatch = void 0;
const puppeteer_1 = require("puppeteer");
const cheerio = require("cheerio");
const winston_1 = require("./winston");
const links_1 = require("../constants/links");
const global_1 = require("../global/global");
const flag = false;
const crawlMatch = async () => {
    let browser;
    let page;
    try {
        browser = await puppeteer_1.default.launch({
            headless: false,
            timeout: 30000,
        });
        page = await browser.newPage();
        await page.goto(links_1.LINKS.SON);
        const content = await page.content();
        const $ = cheerio.load(content);
        const fixtureItmes = $('.timeline_box');
        const matchData = [];
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
            console.log('time', time);
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
                    scores: homeScore && awayScore ? `${homeScore} vs ${awayScore}` : 'vs',
                },
                stadium: {
                    location: location ?? null,
                },
            });
        });
        global_1.Global.matchData = matchData;
        winston_1.winstonLogger.log('close page');
        await page.close();
        winston_1.winstonLogger.log('close browser');
        await browser.close();
    }
    catch (e) {
        winston_1.winstonLogger.error(e);
    }
    finally {
    }
};
exports.crawlMatch = crawlMatch;
//# sourceMappingURL=crawl.js.map