package com.cricket.scoring.service.impl;

import com.cricket.scoring.dto.request.PlayerRequest;
import com.cricket.scoring.dto.response.PlayerResponse;
import com.cricket.scoring.entity.Player;
import com.cricket.scoring.entity.Team;
import com.cricket.scoring.exception.PlayerNotFoundException;
import com.cricket.scoring.exception.ResourceNotFoundException;
import com.cricket.scoring.mapper.PlayerMapper;
import com.cricket.scoring.repository.PlayerRepository;
import com.cricket.scoring.repository.TeamRepository;
import com.cricket.scoring.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Override
    @Transactional
    public PlayerResponse createPlayer(PlayerRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + request.getTeamId()));

        Player player = PlayerMapper.toEntity(request, team);
        Player saved = playerRepository.save(player);
        return PlayerMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlayerResponse> getAllPlayers() {
        return playerRepository.findAll()
                .stream()
                .map(PlayerMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PlayerResponse getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException("Player not found with ID: " + id));
        return PlayerMapper.toResponse(player);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlayerResponse> getPlayersByTeamId(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Team not found with ID: " + teamId);
        }
        return playerRepository.findByTeamId(teamId)
                .stream()
                .map(PlayerMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public PlayerResponse updatePlayer(Long id, PlayerRequest request) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException("Player not found with ID: " + id));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + request.getTeamId()));

        player.setName(request.getName().trim());
        player.setRole(request.getRole());
        player.setTeam(team);

        Player updated = playerRepository.save(player);
        return PlayerMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new PlayerNotFoundException("Player not found with ID: " + id);
        }
        playerRepository.deleteById(id);
    }
}
