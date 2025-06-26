'use client'

import {useQuery} from "@tanstack/react-query";
import {getMatch} from "@/api/agent/default";
import {Match} from "@/types/match";

function useGetMatch() {
    return useQuery<Match[]>({
        queryKey: ['GET_MATCH'],
        queryFn: () => getMatch().then(r => r.data),
        staleTime: 1000 * 60,
    })
}

export default useGetMatch;
