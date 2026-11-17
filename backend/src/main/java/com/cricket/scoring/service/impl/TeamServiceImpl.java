package com.cricket.scoring.service.impl;

import com.cricket.scoring.dto.request.TeamRequest;
import com.cricket.scoring.dto.response.TeamResponse;
import com.cricket.scoring.entity.Team;
import com.cricket.scoring.exception.ResourceNotFoundException;
import com.cricket.scoring.mapper.TeamMapper;
import com.cricket.scoring.repository.TeamRepository;
import com.cricket.scoring.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;

    @Override
    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        if (teamRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new IllegalArgumentException("Team with name '" + request.getName() + "' already exists");
        }
        Team team = TeamMapper.toEntity(request);
        Team saved = teamRepository.save(team);
        return TeamMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll()
                .stream()
                .map(TeamMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));
        return TeamMapper.toResponse(team);
    }

    @Override
    @Transactional
    public TeamResponse updateTeam(Long id, TeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));

        if (!team.getName().equalsIgnoreCase(request.getName().trim()) &&
                teamRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new IllegalArgumentException("Team with name '" + request.getName() + "' already exists");
        }

        team.setName(request.getName().trim());
        team.setShortName(request.getShortName().trim().toUpperCase());
        Team updated = teamRepository.save(team);
        return TeamMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTeam(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team not found with ID: " + id);
        }
        teamRepository.deleteById(id);
    }
}
