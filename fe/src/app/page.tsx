import { getMatch } from '@/api/agent/default';
import { MatchList } from '@/components/modules/MatchList';
import { NotificationPrompt } from '@/components/modules/NotificationPrompt';
import { queryClient } from '@/utils/queryClient';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';


export default async function Home() {
  await queryClient.prefetchQuery({
    queryKey: ['GET_MATCH'],
    queryFn: () => getMatch().then(r => r.data)
  })

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationPrompt />
      </Suspense>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>Loading...</div>}>
          <MatchList />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
