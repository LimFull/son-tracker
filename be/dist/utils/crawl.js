"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlMatch = void 0;
const puppeteer_1 = require("puppeteer");
const cheerio = require("cheerio");
const global_1 = require("../global/global");
const winston_1 = require("./winston");
const crawlMatch = async () => {
    let browser;
    let page;
    try {
        browser = await puppeteer_1.default.launch({
            headless: true,
        });
        page = await browser.newPage();
        await page.goto('https://www.tottenhamhotspur.com/fixtures/men');
        const content = await page.content();
        const $ = cheerio.load(content);
        const fixtureItmes = $('.FixtureItem__desktop');
        const matchData = [];
        fixtureItmes.map((i, v) => {
            const content = $(v);
            const stadiumTag = content.find('.stadium-tag').text();
            const kickoffText = content
                .find('.FixtureItem__kickoff')
                .text()
                .match(/(.*day)(.*)/)
                .slice(1);
            const detailUrl = content
                .find('.FixtureItem__kickoff')
                .find('a')
                .attr('href');
            const crests = content.find('.FixtureItem__crests');
            const logos = [];
            crests.find('img').map((i, v) => logos.push($(v).attr('data-src')));
            const names = [];
            crests.find('p').map((_, v) => names.push($(v).text()));
            const scores = crests.find('.scores').text();
            const stadium = content.find('.FixtureItem__stadium');
            const league = stadium.find('p:nth-child(1)').text();
            const location = stadium.find('.location').text();
            matchData.push({
                stadiumTag: stadiumTag ?? null,
                kickoff: {
                    week: kickoffText?.[0] ?? null,
                    date: kickoffText?.[1] ?? null,
                    detailUrl: detailUrl ?? null,
                },
                crests: {
                    logos: logos ?? null,
                    names: names ?? null,
                    scores: scores ?? null,
                },
                stadium: {
                    league: league ?? null,
                    location: location ?? null,
                },
            });
        });
        global_1.Global.matchData = matchData;
    }
    catch (e) {
        winston_1.winstonLogger.error(e);
    }
    finally {
        winston_1.winstonLogger.log('close page');
        await page.close();
        winston_1.winstonLogger.log('close browser');
        await browser.close();
    }
};
exports.crawlMatch = crawlMatch;
//# sourceMappingURL=crawl.js.map