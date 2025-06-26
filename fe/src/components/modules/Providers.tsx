'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {StyledComponentsRegistry} from "@/components/modules/StyledComponentsRegistry";

const queryClient = new QueryClient()

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <StyledComponentsRegistry>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </StyledComponentsRegistry>
    );
}
