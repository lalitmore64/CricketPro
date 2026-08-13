package com.cricket.scoring.mapper;

import com.cricket.scoring.dto.response.MatchResponse;
import com.cricket.scoring.entity.Match;

import java.util.Collections;

public class MatchMapper {

    private MatchMapper() {}

    public static MatchResponse toResponse(Match match) {
        if (match == null) return null;
        return MatchResponse.builder()
                .id(match.getId())
                .teamA(TeamMapper.toResponse(match.getTeamA()))
                .teamB(TeamMapper.toResponse(match.getTeamB()))
                .venue(match.getVenue())
                .matchDate(match.getMatchDate())
                .status(match.getStatus())
                .totalOvers(match.getTotalOvers())
                .createdAt(match.getCreatedAt())
                .innings(match.getInningsList() != null ?
                        match.getInningsList().stream().map(InningsMapper::toResponse).toList() : Collections.emptyList())
                .build();
    }
}
