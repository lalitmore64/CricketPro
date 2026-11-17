package com.cricket.scoring.mapper;

import com.cricket.scoring.dto.request.PlayerRequest;
import com.cricket.scoring.dto.response.PlayerResponse;
import com.cricket.scoring.entity.Player;
import com.cricket.scoring.entity.Team;

public class PlayerMapper {

    private PlayerMapper() {}

    public static Player toEntity(PlayerRequest request, Team team) {
        if (request == null) return null;
        return Player.builder()
                .name(request.getName().trim())
                .role(request.getRole())
                .team(team)
                .build();
    }

    public static PlayerResponse toResponse(Player player) {
        if (player == null) return null;
        return PlayerResponse.builder()
                .id(player.getId())
                .name(player.getName())
                .role(player.getRole())
                .teamId(player.getTeam() != null ? player.getTeam().getId() : null)
                .teamName(player.getTeam() != null ? player.getTeam().getName() : null)
                .build();
    }
}
