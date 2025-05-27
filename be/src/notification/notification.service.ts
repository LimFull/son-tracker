import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class NotificationService {
  private readonly tokensPath = path.join(process.cwd(), 'data', 'fcm-tokens.json');

  constructor() {
    console.log('NotificationService 초기화 시작');
    console.log('토큰 저장 경로:', this.tokensPath);
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      console.log('데이터 디렉토리 생성 시도:', dataDir);
      
      // data 디렉토리 생성
      await fs.mkdir(dataDir, { recursive: true });
      console.log('데이터 디렉토리 생성 완료');
      
      // 토큰 파일이 없으면 빈 배열로 생성
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

  async registerToken(token: string) {
    try {
      console.log('토큰 등록 시도:', token);
      // 기존 토큰 읽기
      const tokens = JSON.parse(await fs.readFile(this.tokensPath, 'utf-8'));
      console.log('현재 저장된 토큰 수:', tokens.length);
      
      // 중복 체크
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
} 