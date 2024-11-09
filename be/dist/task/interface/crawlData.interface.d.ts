export interface Match {
    stadiumTag?: string;
    kickoff: {
        week?: string[];
        date?: string[];
        detailUrl?: string;
    };
    crests: {
        logos?: string;
        names?: string;
        scores?: string;
    };
    stadium: {
        league?: string;
        location?: string;
    };
}
