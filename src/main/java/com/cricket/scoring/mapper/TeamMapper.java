package com.cricket.scoring.mapper;

import com.cricket.scoring.dto.request.TeamRequest;
import com.cricket.scoring.dto.response.TeamResponse;
import com.cricket.scoring.entity.Team;

import java.util.Collections;

public class TeamMapper {

    private TeamMapper() {}

    public static Team toEntity(TeamRequest request) {
        if (request == null) return null;
        return Team.builder()
                .name(request.getName().trim())
                .shortName(request.getShortName().trim().toUpperCase())
                .build();
    }

    public static TeamResponse toResponse(Team team) {
        if (team == null) return null;
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .shortName(team.getShortName())
                .createdAt(team.getCreatedAt())
                .players(team.getPlayers() != null ?
                        team.getPlayers().stream().map(PlayerMapper::toResponse).toList() : Collections.emptyList())
                .build();
    }
}
