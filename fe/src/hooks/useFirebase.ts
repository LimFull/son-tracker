import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { firebaseConfig } from '@/constants/config';

export const useFirebase = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const registerTokenWithServer = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/notification/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Failed to register token with server');
      }
    } catch (error) {
      console.error('Error registering token with server:', error);
    }
  };

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Firebase 초기화
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        // 알림 권한 확인
        const permission = await Notification.requestPermission();
        console.log('permission', permission);
        setNotificationPermission(permission);

        if (permission === 'granted') {
          // FCM 토큰 얻기
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          });
          
          if (token) {
            console.log('FCM 토큰:', token);
            setFcmToken(token);
            // 서버에 토큰 등록
            await registerTokenWithServer(token);
          }
        }
      } catch (error) {
        console.error('Firebase 초기화 에러:', error);
      }
    };

    initializeFirebase();
  }, []);

  return {
    fcmToken,
    notificationPermission,
  };
};