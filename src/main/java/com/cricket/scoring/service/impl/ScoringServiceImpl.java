package com.cricket.scoring.service.impl;

import com.cricket.scoring.dto.request.BallRequest;
import com.cricket.scoring.dto.response.BallResponse;
import com.cricket.scoring.dto.response.BattingStatResponse;
import com.cricket.scoring.dto.response.BowlingStatResponse;
import com.cricket.scoring.dto.response.ScoreboardResponse;
import com.cricket.scoring.entity.*;
import com.cricket.scoring.enums.ExtraType;
import com.cricket.scoring.enums.InningsStatus;
import com.cricket.scoring.enums.MatchStatus;
import com.cricket.scoring.enums.WicketType;
import com.cricket.scoring.exception.InvalidMatchStateException;
import com.cricket.scoring.exception.InvalidScoringException;
import com.cricket.scoring.exception.PlayerNotFoundException;
import com.cricket.scoring.exception.ResourceNotFoundException;
import com.cricket.scoring.mapper.BallMapper;
import com.cricket.scoring.mapper.ScorecardMapper;
import com.cricket.scoring.repository.*;
import com.cricket.scoring.service.ScoringService;
import com.cricket.scoring.util.OverCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScoringServiceImpl implements ScoringService {

    private final InningsRepository inningsRepository;
    private final BallRepository ballRepository;
    private final PlayerRepository playerRepository;
    private final BattingScorecardRepository battingScorecardRepository;
    private final BowlingScorecardRepository bowlingScorecardRepository;

    @Override
    @Transactional
    public ScoreboardResponse recordBall(Long inningsId, BallRequest request) {
        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new ResourceNotFoundException("Innings not found with ID: " + inningsId));

        validateInningsState(innings);
        validatePlayers(innings, request);

        Player striker = playerRepository.findById(request.getStrikerId()).orElseThrow();
        Player nonStriker = playerRepository.findById(request.getNonStrikerId()).orElseThrow();
        Player bowler = playerRepository.findById(request.getBowlerId()).orElseThrow();

        validateBowlerOver(innings, bowler);

        BattingScorecard strikerCard = getOrCreateBattingScorecard(innings, striker);
        BattingScorecard nonStrikerCard = getOrCreateBattingScorecard(innings, nonStriker);
        BowlingScorecard bowlerCard = getOrCreateBowlingScorecard(innings, bowler);

        ExtraType extraType = request.getExtraType() != null ? request.getExtraType() : ExtraType.NONE;
        boolean isLegal = (extraType != ExtraType.WIDE && extraType != ExtraType.NO_BALL);

        int runsOffBat = request.getRunsOffBat() != null ? request.getRunsOffBat() : 0;
        int extraRuns = calculateExtraRuns(extraType, request.getExtraRuns());
        int totalBallRuns = calculateTotalBallRuns(extraType, runsOffBat, extraRuns);

        innings.setTotalRuns(innings.getTotalRuns() + totalBallRuns);
        if (isLegal) {
            innings.setLegalBalls(innings.getLegalBalls() + 1);
        }

        int overNumber = (innings.getLegalBalls() - (isLegal ? 1 : 0)) / 6;
        int ballNumber = isLegal ? ((innings.getLegalBalls() - 1) % 6) + 1 : (innings.getLegalBalls() % 6);

        updateBatsmanStats(extraType, runsOffBat, strikerCard);

        updateBowlerStats(extraType, runsOffBat, extraRuns, isLegal, bowlerCard);

        Player dismissedPlayer = null;
        if (Boolean.TRUE.equals(request.getWicket())) {
            if (request.getWicketType() == null) {
                throw new InvalidScoringException("WicketType must be provided when wicket is true");
            }
            dismissedPlayer = handleWicket(innings, request, striker, nonStriker, bowler, bowlerCard, strikerCard, nonStrikerCard);
        }

        Ball ball = Ball.builder()
                .innings(innings)
                .overNumber(overNumber)
                .ballNumber(ballNumber)
                .striker(striker)
                .nonStriker(nonStriker)
                .bowler(bowler)
                .runsOffBat(runsOffBat)
                .extraRuns(extraRuns)
                .totalRuns(totalBallRuns)
                .extraType(extraType)
                .wicket(Boolean.TRUE.equals(request.getWicket()))
                .wicketType(request.getWicketType())
                .dismissedPlayer(dismissedPlayer)
                .isLegalDelivery(isLegal)
                .build();

        Ball savedBall = ballRepository.save(ball);

        // Check if over completed or target/wickets reached to close innings
        checkInningsCompletion(innings);
        inningsRepository.save(innings);

        // Determine current effective striker/nonStriker for response
        Player effectiveStriker = striker;
        Player effectiveNonStriker = nonStriker;

        boolean swapStrike = shouldSwapStrike(extraType, runsOffBat, extraRuns);
        boolean isOverCompleted = isLegal && (innings.getLegalBalls() % 6 == 0);

        if (swapStrike) {
            Player temp = effectiveStriker;
            effectiveStriker = effectiveNonStriker;
            effectiveNonStriker = temp;
        }

        if (isOverCompleted) {
            Player temp = effectiveStriker;
            effectiveStriker = effectiveNonStriker;
            effectiveNonStriker = temp;
        }

        BattingScorecard currentStrikerCard = getOrCreateBattingScorecard(innings, effectiveStriker);
        BattingScorecard currentNonStrikerCard = getOrCreateBattingScorecard(innings, effectiveNonStriker);

        return ScoreboardResponse.builder()
                .inningsId(innings.getId())
                .score(innings.getTotalRuns() + "/" + innings.getTotalWickets())
                .overs(OverCalculator.formatOvers(innings.getLegalBalls()))
                .striker(ScorecardMapper.toBattingResponse(currentStrikerCard))
                .nonStriker(ScorecardMapper.toBattingResponse(currentNonStrikerCard))
                .bowler(ScorecardMapper.toBowlingResponse(bowlerCard))
                .lastBall(BallMapper.toResponse(savedBall))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ScoreboardResponse getScoreboard(Long inningsId) {
        Innings innings = inningsRepository.findById(inningsId)
                .orElseThrow(() -> new ResourceNotFoundException("Innings not found with ID: " + inningsId));

        Optional<Ball> lastBallOpt = ballRepository.findTopByInningsIdOrderByIdDesc(inningsId);
        BattingStatResponse strikerStat = null;
        BattingStatResponse nonStrikerStat = null;
        BowlingStatResponse bowlerStat = null;
        BallResponse lastBallResponse = null;

        if (lastBallOpt.isPresent()) {
            Ball lastBall = lastBallOpt.get();
            lastBallResponse = BallMapper.toResponse(lastBall);

            Optional<BattingScorecard> strikerCard = battingScorecardRepository.findByInningsIdAndPlayerId(inningsId, lastBall.getStriker().getId());
            Optional<BattingScorecard> nonStrikerCard = battingScorecardRepository.findByInningsIdAndPlayerId(inningsId, lastBall.getNonStriker().getId());
            Optional<BowlingScorecard> bowlerCard = bowlingScorecardRepository.findByInningsIdAndPlayerId(inningsId, lastBall.getBowler().getId());

            strikerStat = strikerCard.map(ScorecardMapper::toBattingResponse).orElse(null);
            nonStrikerStat = nonStrikerCard.map(ScorecardMapper::toBattingResponse).orElse(null);
            bowlerStat = bowlerCard.map(ScorecardMapper::toBowlingResponse).orElse(null);
        }

        return ScoreboardResponse.builder()
                .inningsId(innings.getId())
                .score(innings.getTotalRuns() + "/" + innings.getTotalWickets())
                .overs(OverCalculator.formatOvers(innings.getLegalBalls()))
                .striker(strikerStat)
                .nonStriker(nonStrikerStat)
                .bowler(bowlerStat)
                .lastBall(lastBallResponse)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BallResponse> getBallHistory(Long inningsId) {
        if (!inningsRepository.existsById(inningsId)) {
            throw new ResourceNotFoundException("Innings not found with ID: " + inningsId);
        }
        return ballRepository.findByInningsIdOrderByIdAsc(inningsId)
                .stream()
                .map(BallMapper::toResponse)
                .toList();
    }

    private void validateInningsState(Innings innings) {
        if (innings.getStatus() == InningsStatus.COMPLETED) {
            throw new InvalidMatchStateException("Cannot add balls to a COMPLETED innings (ID: " + innings.getId() + ")");
        }
        if (innings.getMatch().getStatus() == MatchStatus.COMPLETED) {
            throw new InvalidMatchStateException("Cannot add balls to a COMPLETED match (ID: " + innings.getMatch().getId() + ")");
        }
        if (innings.getTotalWickets() >= 10) {
            throw new InvalidScoringException("Innings has already reached maximum wickets (10)");
        }
    }

    private void validatePlayers(Innings innings, BallRequest request) {
        if (request.getStrikerId().equals(request.getNonStrikerId())) {
            throw new InvalidScoringException("Striker and non-striker cannot be the same player");
        }

        Player striker = playerRepository.findById(request.getStrikerId())
                .orElseThrow(() -> new PlayerNotFoundException("Striker player not found with ID: " + request.getStrikerId()));
        Player nonStriker = playerRepository.findById(request.getNonStrikerId())
                .orElseThrow(() -> new PlayerNotFoundException("Non-striker player not found with ID: " + request.getNonStrikerId()));
        Player bowler = playerRepository.findById(request.getBowlerId())
                .orElseThrow(() -> new PlayerNotFoundException("Bowler player not found with ID: " + request.getBowlerId()));

        if (!striker.getTeam().getId().equals(innings.getBattingTeam().getId())) {
            throw new InvalidScoringException("Striker " + striker.getName() + " does not belong to batting team " + innings.getBattingTeam().getName());
        }
        if (!nonStriker.getTeam().getId().equals(innings.getBattingTeam().getId())) {
            throw new InvalidScoringException("Non-striker " + nonStriker.getName() + " does not belong to batting team " + innings.getBattingTeam().getName());
        }
        if (!bowler.getTeam().getId().equals(innings.getBowlingTeam().getId())) {
            throw new InvalidScoringException("Bowler " + bowler.getName() + " does not belong to bowling team " + innings.getBowlingTeam().getName());
        }

        // Validate dismissed batsmen cannot bat
        battingScorecardRepository.findByInningsIdAndPlayerId(innings.getId(), striker.getId())
                .ifPresent(card -> {
                    if (Boolean.TRUE.equals(card.getIsOut())) {
                        throw new InvalidScoringException("Dismissed player " + striker.getName() + " cannot bat again");
                    }
                });

        battingScorecardRepository.findByInningsIdAndPlayerId(innings.getId(), nonStriker.getId())
                .ifPresent(card -> {
                    if (Boolean.TRUE.equals(card.getIsOut())) {
                        throw new InvalidScoringException("Dismissed player " + nonStriker.getName() + " cannot bat again");
                    }
                });
    }

    private void validateBowlerOver(Innings innings, Player currentBowler) {
        // If start of new over (legalBalls > 0 and legalBalls % 6 == 0)
        int legalBalls = innings.getLegalBalls();
        if (legalBalls > 0 && legalBalls % 6 == 0) {
            Optional<Ball> lastBallOpt = ballRepository.findTopByInningsIdOrderByIdDesc(innings.getId());
            if (lastBallOpt.isPresent()) {
                Player previousBowler = lastBallOpt.get().getBowler();
                if (previousBowler.getId().equals(currentBowler.getId())) {
                    throw new InvalidScoringException("Bowler " + currentBowler.getName() + " cannot bowl consecutive overs");
                }
            }
        }
    }

    private int calculateExtraRuns(ExtraType extraType, Integer requestedExtraRuns) {
        int provided = (requestedExtraRuns != null && requestedExtraRuns > 0) ? requestedExtraRuns : 0;
        return switch (extraType) {
            case WIDE, NO_BALL -> provided > 0 ? provided : 1;
            case BYE, LEG_BYE -> provided > 0 ? provided : 1;
            case NONE -> 0;
        };
    }

    private int calculateTotalBallRuns(ExtraType extraType, int runsOffBat, int extraRuns) {
        return switch (extraType) {
            case WIDE -> extraRuns;
            case NO_BALL -> extraRuns + runsOffBat;
            case BYE, LEG_BYE -> extraRuns;
            case NONE -> runsOffBat;
        };
    }

    private void updateBatsmanStats(ExtraType extraType, int runsOffBat, BattingScorecard strikerCard) {
        if (extraType == ExtraType.NONE) {
            strikerCard.setRuns(strikerCard.getRuns() + runsOffBat);
            strikerCard.setBallsFaced(strikerCard.getBallsFaced() + 1);
            if (runsOffBat == 4) strikerCard.setFours(strikerCard.getFours() + 1);
            if (runsOffBat == 6) strikerCard.setSixes(strikerCard.getSixes() + 1);
        } else if (extraType == ExtraType.NO_BALL) {
            strikerCard.setRuns(strikerCard.getRuns() + runsOffBat);
            strikerCard.setBallsFaced(strikerCard.getBallsFaced() + 1);
            if (runsOffBat == 4) strikerCard.setFours(strikerCard.getFours() + 1);
            if (runsOffBat == 6) strikerCard.setSixes(strikerCard.getSixes() + 1);
        } else if (extraType == ExtraType.BYE || extraType == ExtraType.LEG_BYE) {
            strikerCard.setBallsFaced(strikerCard.getBallsFaced() + 1);
        }
        // WIDE does not increment batsman runs or ballsFaced
        battingScorecardRepository.save(strikerCard);
    }

    private void updateBowlerStats(ExtraType extraType, int runsOffBat, int extraRuns, boolean isLegal, BowlingScorecard bowlerCard) {
        if (isLegal) {
            bowlerCard.setLegalBalls(bowlerCard.getLegalBalls() + 1);
        }

        if (extraType == ExtraType.WIDE) {
            bowlerCard.setWides(bowlerCard.getWides() + 1);
            bowlerCard.setRunsConceded(bowlerCard.getRunsConceded() + extraRuns);
        } else if (extraType == ExtraType.NO_BALL) {
            bowlerCard.setNoBalls(bowlerCard.getNoBalls() + 1);
            bowlerCard.setRunsConceded(bowlerCard.getRunsConceded() + extraRuns + runsOffBat);
        } else if (extraType == ExtraType.NONE) {
            bowlerCard.setRunsConceded(bowlerCard.getRunsConceded() + runsOffBat);
        }
        // Byes and Leg-Byes are not charged to bowler's runsConceded
        bowlingScorecardRepository.save(bowlerCard);
    }

    private Player handleWicket(Innings innings, BallRequest request, Player striker, Player nonStriker, Player bowler,
                                BowlingScorecard bowlerCard, BattingScorecard strikerCard, BattingScorecard nonStrikerCard) {
        innings.setTotalWickets(innings.getTotalWickets() + 1);

        Player dismissed = striker;
        if (request.getDismissedPlayerId() != null) {
            if (request.getDismissedPlayerId().equals(nonStriker.getId())) {
                dismissed = nonStriker;
            } else if (!request.getDismissedPlayerId().equals(striker.getId())) {
                throw new InvalidScoringException("Dismissed player must be either striker or non-striker");
            }
        }

        BattingScorecard dismissedCard = (dismissed.getId().equals(striker.getId())) ? strikerCard : nonStrikerCard;
        dismissedCard.setIsOut(true);
        dismissedCard.setDismissalType(request.getWicketType());
        dismissedCard.setBowler(bowler);
        battingScorecardRepository.save(dismissedCard);

        if (request.getWicketType().isBowlerWicket()) {
            bowlerCard.setWickets(bowlerCard.getWickets() + 1);
            bowlingScorecardRepository.save(bowlerCard);
        }

        return dismissed;
    }

    private boolean shouldSwapStrike(ExtraType extraType, int runsOffBat, int extraRuns) {
        int completedRuns = switch (extraType) {
            case NONE -> runsOffBat;
            case NO_BALL -> runsOffBat + (extraRuns > 1 ? extraRuns - 1 : 0);
            case WIDE -> extraRuns > 1 ? extraRuns - 1 : 0;
            case BYE, LEG_BYE -> extraRuns;
        };
        return completedRuns % 2 != 0;
    }

    private void checkInningsCompletion(Innings innings) {
        Match match = innings.getMatch();
        int maxLegalBalls = match.getTotalOvers() * 6;

        if (innings.getTotalWickets() >= 10 || innings.getLegalBalls() >= maxLegalBalls) {
            innings.setStatus(InningsStatus.COMPLETED);
        }
    }

    private BattingScorecard getOrCreateBattingScorecard(Innings innings, Player player) {
        return battingScorecardRepository.findByInningsIdAndPlayerId(innings.getId(), player.getId())
                .orElseGet(() -> battingScorecardRepository.save(BattingScorecard.builder()
                        .innings(innings)
                        .player(player)
                        .runs(0)
                        .ballsFaced(0)
                        .fours(0)
                        .sixes(0)
                        .isOut(false)
                        .build()));
    }

    private BowlingScorecard getOrCreateBowlingScorecard(Innings innings, Player player) {
        return bowlingScorecardRepository.findByInningsIdAndPlayerId(innings.getId(), player.getId())
                .orElseGet(() -> bowlingScorecardRepository.save(BowlingScorecard.builder()
                        .innings(innings)
                        .player(player)
                        .legalBalls(0)
                        .runsConceded(0)
                        .wickets(0)
                        .wides(0)
                        .noBalls(0)
                        .build()));
    }
}
