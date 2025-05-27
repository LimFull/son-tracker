'use client';

import { useEffect, useMemo } from "react";
import useGetMatch from "@/hooks/useGetMatch";
import { groupBy } from "lodash";
import styled from "styled-components";
import MatchCard from "@/components/modules/MatchCard";

export function MatchList() {
  const { data: matchData } = useGetMatch();

  const groupedMatch = useMemo(() => {
    if (!matchData) {
      return [];
    }

    const grouped = Object.values(
      groupBy(matchData, (match) => match.kickoff.week?.split(".")[0]),
    );
    return grouped;
  }, [matchData]);

  useEffect(() => {
    console.log("matchData", matchData);
  }, [matchData]);

  return (
    <Container>
      {groupedMatch.map((matches, matchesIndex) => {
        const month = matches[0].kickoff.week?.split(".")[0];

        return (
          <Group key={matchesIndex}>
            <div className="month">{month}</div>
            <MatchCards>
              {matches.map((match, matchIndex) => {
                return <MatchCard data={match} key={matchIndex} />;
              })}
            </MatchCards>
          </Group>
        );
      })}
    </Container>
  );
}

const MatchCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Group = styled.div`
  .month {
    text-transform: uppercase;
    font-weight: 400;
    text-align: center;
    margin: 20px 0 10px;
    font-size: 20px;
    color: #0b0e1e;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`; 

export default MatchList;