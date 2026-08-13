package com.cricket.scoring.service;

import com.cricket.scoring.dto.request.TeamRequest;
import com.cricket.scoring.dto.response.TeamResponse;

import java.util.List;

public interface TeamService {
    TeamResponse createTeam(TeamRequest request);
    List<TeamResponse> getAllTeams();
    TeamResponse getTeamById(Long id);
    TeamResponse updateTeam(Long id, TeamRequest request);
    void deleteTeam(Long id);
}
