export interface Match {
  kickoff: {
    week: string;
    date: string;
    state: string;
  };
  crests: {
    names: string[];
    scores: string;
  };
  stadium: {
    location: string;
  };
} 