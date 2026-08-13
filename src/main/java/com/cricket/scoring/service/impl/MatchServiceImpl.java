package com.cricket.scoring.service.impl;

import com.cricket.scoring.dto.request.InningsRequest;
import com.cricket.scoring.dto.request.MatchRequest;
import com.cricket.scoring.dto.response.*;
import com.cricket.scoring.entity.Ball;
import com.cricket.scoring.entity.Innings;
import com.cricket.scoring.entity.Match;
import com.cricket.scoring.entity.Team;
import com.cricket.scoring.enums.InningsStatus;
import com.cricket.scoring.enums.MatchStatus;
import com.cricket.scoring.exception.InvalidMatchStateException;
import com.cricket.scoring.exception.MatchAlreadyCompletedException;
import com.cricket.scoring.exception.ResourceNotFoundException;
import com.cricket.scoring.mapper.BallMapper;
import com.cricket.scoring.mapper.InningsMapper;
import com.cricket.scoring.mapper.MatchMapper;
import com.cricket.scoring.repository.BallRepository;
import com.cricket.scoring.repository.InningsRepository;
import com.cricket.scoring.repository.MatchRepository;
import com.cricket.scoring.repository.TeamRepository;
import com.cricket.scoring.service.MatchService;
import com.cricket.scoring.service.ScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final InningsRepository inningsRepository;
    private final BallRepository ballRepository;
    private final ScoringService scoringService;

    public MatchServiceImpl(MatchRepository matchRepository,
                            TeamRepository teamRepository,
                            InningsRepository inningsRepository,
                            BallRepository ballRepository,
                            @Lazy ScoringService scoringService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.inningsRepository = inningsRepository;
        this.ballRepository = ballRepository;
        this.scoringService = scoringService;
    }

    @Override
    @Transactional
    public MatchResponse createMatch(MatchRequest request) {
        if (request.getTeamAId().equals(request.getTeamBId())) {
            throw new IllegalArgumentException("Team A and Team B cannot be the same team");
        }

        Team teamA = teamRepository.findById(request.getTeamAId())
                .orElseThrow(() -> new ResourceNotFoundException("Team A not found with ID: " + request.getTeamAId()));

        Team teamB = teamRepository.findById(request.getTeamBId())
                .orElseThrow(() -> new ResourceNotFoundException("Team B not found with ID: " + request.getTeamBId()));

        Match match = Match.builder()
                .teamA(teamA)
                .teamB(teamB)
                .venue(request.getVenue().trim())
                .matchDate(request.getMatchDate())
                .totalOvers(request.getTotalOvers())
                .status(MatchStatus.UPCOMING)
                .build();

        Match saved = matchRepository.save(match);
        return MatchMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(MatchMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MatchResponse getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with ID: " + id));
        return MatchMapper.toResponse(match);
    }

    @Override
    @Transactional
    public MatchResponse startMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with ID: " + matchId));

        if (match.getStatus() == MatchStatus.COMPLETED) {
            throw new MatchAlreadyCompletedException("Cannot start match with ID " + matchId + " because it is already COMPLETED");
        }

        match.setStatus(MatchStatus.LIVE);
        Match updated = matchRepository.save(match);
        return MatchMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public MatchResponse completeMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with ID: " + matchId));

        if (match.getStatus() == MatchStatus.COMPLETED) {
            throw new MatchAlreadyCompletedException("Match with ID " + matchId + " is already COMPLETED");
        }

        match.setStatus(MatchStatus.COMPLETED);
        // Also complete all active innings
        for (Innings innings : match.getInningsList()) {
            if (innings.getStatus() == InningsStatus.IN_PROGRESS) {
                innings.setStatus(InningsStatus.COMPLETED);
            }
        }

        Match updated = matchRepository.save(match);
        return MatchMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public InningsResponse createInnings(Long matchId, InningsRequest request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with ID: " + matchId));

        if (match.getStatus() == MatchStatus.COMPLETED) {
            throw new MatchAlreadyCompletedException("Cannot create innings for completed match with ID: " + matchId);
        }

        // Auto-transition match status to LIVE if UPCOMING
        if (match.getStatus() == MatchStatus.UPCOMING) {
            match.setStatus(MatchStatus.LIVE);
            matchRepository.save(match);
        }

        if (request.getBattingTeamId().equals(request.getBowlingTeamId())) {
            throw new IllegalArgumentException("Batting team and Bowling team cannot be the same");
        }

        boolean isValidTeams = (request.getBattingTeamId().equals(match.getTeamA().getId()) && request.getBowlingTeamId().equals(match.getTeamB().getId()))
                || (request.getBattingTeamId().equals(match.getTeamB().getId()) && request.getBowlingTeamId().equals(match.getTeamA().getId()));

        if (!isValidTeams) {
            throw new IllegalArgumentException("Teams in innings must match the teams assigned to this match");
        }

        Optional<Innings> existingInnings = inningsRepository.findByMatchIdAndInningsNumber(matchId, request.getInningsNumber());
        if (existingInnings.isPresent()) {
            throw new InvalidMatchStateException("Innings number " + request.getInningsNumber() + " already exists for match ID: " + matchId);
        }

        Team battingTeam = teamRepository.findById(request.getBattingTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Batting team not found with ID: " + request.getBattingTeamId()));

        Team bowlingTeam = teamRepository.findById(request.getBowlingTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Bowling team not found with ID: " + request.getBowlingTeamId()));

        Innings innings = Innings.builder()
                .match(match)
                .battingTeam(battingTeam)
                .bowlingTeam(bowlingTeam)
                .inningsNumber(request.getInningsNumber())
                .totalRuns(0)
                .totalWickets(0)
                .legalBalls(0)
                .status(InningsStatus.IN_PROGRESS)
                .build();

        Innings saved = inningsRepository.save(innings);
        return InningsMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InningsResponse getInningsById(Long inningsId) {
        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new ResourceNotFoundException("Innings not found with ID: " + inningsId));
        return InningsMapper.toResponse(innings);
    }

    @Override
    @Transactional(readOnly = true)
    public MatchScorecardResponse getMatchScorecard(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with ID: " + matchId));

        List<InningsResponse> inningsResponses = inningsRepository.findByMatchIdOrderByInningsNumberAsc(matchId)
                .stream()
                .map(InningsMapper::toResponse)
                .toList();

        // Get latest active innings scoreboard if available
        ScoreboardResponse currentScoreboard = null;
        List<BallResponse> ballHistory = List.of();

        List<Innings> inningsList = inningsRepository.findByMatchIdOrderByInningsNumberAsc(matchId);
        if (!inningsList.isEmpty()) {
            Innings latestInnings = inningsList.get(inningsList.size() - 1);
            currentScoreboard = scoringService.getScoreboard(latestInnings.getId());

            List<Ball> balls = ballRepository.findByInningsIdOrderByIdAsc(latestInnings.getId());
            ballHistory = balls.stream().map(BallMapper::toResponse).toList();
        }

        return MatchScorecardResponse.builder()
                .matchId(match.getId())
                .teamA(match.getTeamA().getName())
                .teamB(match.getTeamB().getName())
                .venue(match.getVenue())
                .matchDate(match.getMatchDate())
                .matchStatus(match.getStatus())
                .totalOvers(match.getTotalOvers())
                .inningsScorecards(inningsResponses)
                .currentScoreboard(currentScoreboard)
                .ballHistory(ballHistory)
                .build();
    }
}
