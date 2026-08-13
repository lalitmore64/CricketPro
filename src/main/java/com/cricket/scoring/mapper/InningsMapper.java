package com.cricket.scoring.mapper;

import com.cricket.scoring.dto.response.InningsResponse;
import com.cricket.scoring.entity.Innings;
import com.cricket.scoring.util.OverCalculator;

import java.util.Collections;

public class InningsMapper {

    private InningsMapper() {}

    public static InningsResponse toResponse(Innings innings) {
        if (innings == null) return null;

        return InningsResponse.builder()
                .id(innings.getId())
                .matchId(innings.getMatch() != null ? innings.getMatch().getId() : null)
                .battingTeam(TeamMapper.toResponse(innings.getBattingTeam()))
                .bowlingTeam(TeamMapper.toResponse(innings.getBowlingTeam()))
                .inningsNumber(innings.getInningsNumber())
                .totalRuns(innings.getTotalRuns())
                .totalWickets(innings.getTotalWickets())
                .overs(OverCalculator.formatOvers(innings.getLegalBalls()))
                .legalBalls(innings.getLegalBalls())
                .status(innings.getStatus())
                .battingScorecard(innings.getBattingScorecards() != null ?
                        innings.getBattingScorecards().stream().map(ScorecardMapper::toBattingResponse).toList() : Collections.emptyList())
                .bowlingScorecard(innings.getBowlingScorecards() != null ?
                        innings.getBowlingScorecards().stream().map(ScorecardMapper::toBowlingResponse).toList() : Collections.emptyList())
                .build();
    }
}
