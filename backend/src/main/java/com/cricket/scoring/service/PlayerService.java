package com.cricket.scoring.service;

import com.cricket.scoring.dto.request.PlayerRequest;
import com.cricket.scoring.dto.response.PlayerResponse;

import java.util.List;

public interface PlayerService {
    PlayerResponse createPlayer(PlayerRequest request);
    List<PlayerResponse> getAllPlayers();
    PlayerResponse getPlayerById(Long id);
    List<PlayerResponse> getPlayersByTeamId(Long teamId);
    PlayerResponse updatePlayer(Long id, PlayerRequest request);
    void deletePlayer(Long id);
}
