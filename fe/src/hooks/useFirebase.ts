import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import { firebaseConfig } from '@/constants/config';

export const useFirebase = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [messaging, setMessaging] = useState<Messaging | null>(null);

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

  const requestNotificationPermission = async () => {
    try {
      if (!messaging) {
        console.error('Firebase Messaging이 초기화되지 않았습니다.');
        return;
      }

      console.log('알림 권한 요청 시작');
      const permission = await Notification.requestPermission();
      console.log('권한 요청 결과:', permission);
      setNotificationPermission(permission);

      if (permission === 'granted') {
        console.log('권한이 허용됨, 토큰 요청 시작');
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });
        
        if (token) {
          console.log('FCM 토큰 발급 성공:', token);
          setFcmToken(token);
          await registerTokenWithServer(token);
        } else {
          console.log('토큰을 받지 못했습니다.');
        }
      } else {
        console.log('알림 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('알림 권한 요청 에러:', error);
      console.error('에러 상세:', error instanceof Error ? error.message : '알 수 없는 에러');
    }
  };

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        console.log('Firebase 초기화 시작');
        const app = initializeApp(firebaseConfig);
        const messagingInstance = getMessaging(app);
        setMessaging(messagingInstance);
        console.log('Firebase 초기화 완료');

        // 현재 알림 권한 상태 확인
        const currentPermission = Notification.permission;
        console.log('현재 알림 권한 상태:', currentPermission);
        setNotificationPermission(currentPermission);
      } catch (error) {
        console.error('Firebase 초기화 에러:', error);
        console.error('에러 상세:', error instanceof Error ? error.message : '알 수 없는 에러');
      }
    };

    initializeFirebase();
  }, []);

  return {
    fcmToken,
    notificationPermission,
    requestNotificationPermission,
  };
};