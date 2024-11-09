'use client'

import {Match} from "@/types/match";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

interface Props {
    data: Match
}

function MatchCard({data}: Props) {

    return <StyledLink className={`${!data.kickoff.detailUrl ? 'disable' : ''}`}
                       href={data.kickoff.detailUrl ?? ''}
                       target={'_blank'} rel={'noopener noreferrer nofollow'}>
        <Container>
            <DateArea>
                <h2>{data.kickoff.week}</h2>
                <h1>{data.kickoff.date}</h1>
            </DateArea>
            <ScoreArea>
                <div className='img-card'>
                    <Image src={data.crests.logos?.[0] ?? ''} alt={'team-logo'} width={50} height={50}/>
                    {data.crests.names?.[0] ?? ''}
                </div>
                {data.crests.scores}
                <div className='img-card'>
                    <Image src={data.crests.logos?.[1] ?? ''} alt={'team-logo'} width={50} height={50}/>
                    {data.crests.names?.[1] ?? ''}
                </div>
            </ScoreArea>
        </Container>
    </StyledLink>
}

const StyledLink = styled(Link)`
    &.disable {
        pointer-events: none;
    }
`

const ScoreArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #111836;
    font-size: 20px;

    .img-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 16px;
    }

`

const DateArea = styled.div`
    display: flex;
    flex-direction: column;
    color: #111836;
    text-align: center;

    h2 {
        font-size: 12px;
    }

    h1 {
        font-size: 18px;
    }


`

const Container = styled.div`
    background-color: rgb(238, 240, 241);
    padding: 10px 0;
`

export default MatchCard;
