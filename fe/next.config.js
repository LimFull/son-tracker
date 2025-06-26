const fs = require('fs');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/son-tracker' : '',
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // 서버가 아닐 때 (클라이언트 빌드일 때) Service Worker 생성
    if (!isServer) {
      // Service Worker 파일 생성
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      };
      
      const basePath = process.env.NODE_ENV === 'production' ? '/son-tracker' : '';
      
      const swContent = `
// Firebase App 버전 임포트 (반드시 첫 번째로 임포트)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase 초기화
firebase.initializeApp(${JSON.stringify(firebaseConfig, null, 2)});

// Firebase Messaging 인스턴스 가져오기
const messaging = firebase.messaging();

// 백그라운드 메시지 핸들러
messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '${basePath}/icon512_rounded.png',
    badge: '${basePath}/icon512_rounded.png',
    tag: 'son-tracker-notification',
    data: payload.data,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});`;
      
      // public 디렉토리가 없으면 생성
      const publicDir = path.join(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }
      
      // Service Worker 파일 생성
      fs.writeFileSync(
        path.join(publicDir, 'firebase-messaging-sw.js'),
        swContent
      );

      console.log('Service Worker 파일이 생성되었습니다.');
    }
    return config;
  },
};

module.exports = nextConfig; 