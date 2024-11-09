import {api} from "@/api";
import {Match} from "@/types/match";
import {AxiosResponse} from "axios";

export function getMatch(): Promise<AxiosResponse<Match[]>> {
    return api.default.get<Match[]>(`/match`);
}
