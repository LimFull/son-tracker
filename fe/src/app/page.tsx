"use client";

import { useEffect } from "react";
import { useFirebase } from '@/hooks/useFirebase';
import { MatchList } from '@/components/modules/MatchList';
import { NotificationPrompt } from '@/components/modules/NotificationPrompt';

export default function Home() {
  const { notificationPermission, requestNotificationPermission } = useFirebase();

  useEffect(() => {
    console.log('Notification Permission:', notificationPermission);
  }, [notificationPermission]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <NotificationPrompt
        permission={notificationPermission}
        onRequestPermission={requestNotificationPermission}
      />
      <MatchList />
    </main>
  );
}
