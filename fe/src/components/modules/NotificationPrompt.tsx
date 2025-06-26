"use client";

import { useEffect } from "react";
import { useFirebase } from '@/hooks/useFirebase';



export const NotificationPrompt = () => {
  const { notificationPermission, requestNotificationPermission } = useFirebase();

  useEffect(() => {
    console.log('Notification Permission:', notificationPermission);
  }, [notificationPermission]);

  switch (notificationPermission) {
    case 'default':
      return (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <p className="mb-2">손흥민의 경기 알림을 받아보시겠습니까?</p>
          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            알림 받기
          </button>
        </div>
      );
    case 'denied':
      return (
        <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-800">
            알림이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.
          </p>
        </div>
      );
    default:
      return null;
  }
}; 