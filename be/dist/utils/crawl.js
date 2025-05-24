"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlMatch = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const cheerio = __importStar(require("cheerio"));
const winston_1 = require("./winston");
const links_1 = require("../constants/links");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const fs = __importStar(require("node:fs"));
const crawlMatch = async () => {
    let browser;
    let page;
    try {
        browser = await puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)()).launch({
            headless: true,
            timeout: 60000,
            executablePath: '/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-extensions',
                '--no-first-run',
            ],
        });
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (resourceType === 'stylesheet' || resourceType === 'font') {
                request.abort();
            }
            else {
                request.continue();
            }
        });
        await page.goto(links_1.LINKS.SON, { waitUntil: 'networkidle0' });
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
        fs.writeFile('./result.json', JSON.stringify(matchData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('File Saved');
            }
        });
    }
    catch (e) {
        winston_1.winstonLogger.error(e);
    }
    finally {
        try {
            winston_1.winstonLogger.log('close page');
            await page.close();
            winston_1.winstonLogger.log('close browser');
            await browser.close();
        }
        catch (e) {
            winston_1.winstonLogger.log('finally에서 에러났습니다', e);
        }
    }
};
exports.crawlMatch = crawlMatch;
//# sourceMappingURL=crawl.js.map