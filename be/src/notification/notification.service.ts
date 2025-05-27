import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as admin from 'firebase-admin';
import { Cron } from '@nestjs/schedule';
import Global from '../global/global';
import { Match } from '../task/interface/crawlData.interface';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly tokensPath = path.join(
    process.cwd(),
    'data',
    'fcm-tokens.json',
  );

  constructor() {
    console.log('NotificationService 초기화 시작');
    console.log('토큰 저장 경로:', this.tokensPath);
    this.initializeStorage();
    this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    try {
      console.log('Firebase 환경변수 확인:');
      console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
      console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
      console.log('PRIVATE_KEY 존재 여부:', !!process.env.FIREBASE_PRIVATE_KEY);

      const config = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
      
      console.log('Firebase 설정:', config);

      admin.initializeApp({
        credential: admin.credential.cert(config),
      });
      console.log('Firebase Admin SDK 초기화 완료');
    } catch (error) {
      console.error('Firebase Admin SDK 초기화 실패:', error);
    }
  }

  private async initializeStorage() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      console.log('데이터 디렉토리 생성 시도:', dataDir);
      await fs.mkdir(dataDir, { recursive: true });
      console.log('데이터 디렉토리 생성 완료');

      try {
        await fs.access(this.tokensPath);
        console.log('토큰 파일이 이미 존재함');
      } catch {
        console.log('토큰 파일 생성');
        await fs.writeFile(this.tokensPath, JSON.stringify([]));
        console.log('토큰 파일 생성 완료');
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
    }
  }

  private async getTomorrowMatch(): Promise<Match | null> {
    try {
      const matches = await Global.getData();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow
        .toLocaleDateString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
        })
        .replace('. ', '.')
        .slice(0, -1);

      return (
        matches.find((match) => {
          const matchDate = match.kickoff.week.split('.').slice(0, 2).join('.');
          return matchDate === tomorrowStr && match.kickoff.state === '';
        }) || null
      );
    } catch (error) {
      console.error('경기 정보 읽기 실패:', error);
      return null;
    }
  }

  async registerToken(token: string) {
    try {
      console.log('토큰 등록 시도:', token);
      const tokens = JSON.parse(await fs.readFile(this.tokensPath, 'utf-8'));
      console.log('현재 저장된 토큰 수:', tokens.length);

      if (!tokens.includes(token)) {
        tokens.push(token);
        await fs.writeFile(this.tokensPath, JSON.stringify(tokens, null, 2));
        console.log('새 토큰 등록 완료');
      } else {
        console.log('이미 등록된 토큰');
      }

      return { success: true };
    } catch (error) {
      console.error('Token registration error:', error);
      return { success: false, error: 'Failed to register token' };
    }
  }

  async getAllTokens(): Promise<string[]> {
    try {
      const tokens = JSON.parse(await fs.readFile(this.tokensPath, 'utf-8'));
      console.log('전체 토큰 조회:', tokens.length);
      return tokens;
    } catch (error) {
      console.error('Error reading tokens:', error);
      return [];
    }
  }

  @Cron('0 10 * * *')
  async sendMatchNotification() {
    try {
      const tomorrowMatch = await this.getTomorrowMatch();
      if (!tomorrowMatch) {
        console.log('내일 예정된 경기가 없습니다.');
        return;
      }

      const tokens = await this.getAllTokens();
      if (tokens.length === 0) {
        console.log('등록된 FCM 토큰이 없습니다.');
        return;
      }

      const homeTeam = tomorrowMatch.crests.names[0].trim();
      const awayTeam = tomorrowMatch.crests.names[1].trim();
      const matchTime = tomorrowMatch.kickoff.date.trim();
      const stadium = tomorrowMatch.stadium.location || '경기장 미정';

      const messages = tokens.map((token) => ({
        token,
        notification: {
          title: '내일 손흥민 경기 알림',
          body: `내일 ${matchTime} ${homeTeam} vs ${awayTeam}\n경기장: ${stadium}`,
        },
      }));

      const response = await admin.messaging().sendEach(messages);
      console.log('알림 전송 결과:', response);

      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });

        if (failedTokens.length > 0) {
          const validTokens = tokens.filter(
            (token) => !failedTokens.includes(token),
          );
          await fs.writeFile(
            this.tokensPath,
            JSON.stringify(validTokens, null, 2),
          );
          console.log(
            `${failedTokens.length}개의 유효하지 않은 토큰이 제거되었습니다.`,
          );
        }
      }
    } catch (error) {
      console.error('알림 전송 실패:', error);
    }
  }

  async onModuleInit() {
    try {
      const tokens = await this.getAllTokens();
      if (tokens.length === 0) {
        console.log('등록된 FCM 토큰이 없습니다.');
        return;
      }

      const messages = tokens.map((token) => ({
        token,
        notification: {
          title: '푸시 알림 테스트',
          body: '서버가 시작되었습니다. 푸시 알림이 정상적으로 작동합니다.',
        },
      }));

      const response = await admin.messaging().sendEach(messages);
      console.log('테스트 알림 전송 결과:', response);
    } catch (error) {
      console.error('테스트 알림 전송 실패:', error);
    }
  }
} 