"use client";

import { useEffect } from "react";
import { useFirebase } from '@/hooks/useFirebase';
import { MatchList } from '@/components/modules/MatchList';

export default function Home() {
  const { notificationPermission } = useFirebase();

  useEffect(() => {
    // 알림 권한 상태 로깅 (디버깅용)
    console.log('Notification Permission:', notificationPermission);
  }, [notificationPermission]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <MatchList />
    </main>
  );
}
