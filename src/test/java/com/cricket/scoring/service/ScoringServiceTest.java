package com.cricket.scoring.service;

import com.cricket.scoring.dto.request.BallRequest;
import com.cricket.scoring.dto.response.ScoreboardResponse;
import com.cricket.scoring.entity.*;
import com.cricket.scoring.enums.ExtraType;
import com.cricket.scoring.enums.InningsStatus;
import com.cricket.scoring.enums.MatchStatus;
import com.cricket.scoring.enums.PlayerRole;
import com.cricket.scoring.enums.WicketType;
import com.cricket.scoring.exception.InvalidScoringException;
import com.cricket.scoring.repository.*;
import com.cricket.scoring.service.impl.ScoringServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ScoringServiceTest {

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private BattingScorecardRepository battingScorecardRepository;

    @Autowired
    private BowlingScorecardRepository bowlingScorecardRepository;

    private Team teamIndia;
    private Team teamAustralia;
    private Player rohit;
    private Player kohli;
    private Player gill;
    private Player starc;
    private Player cummins;
    private Match match;
    private Innings innings;

    @BeforeEach
    void setUp() {
        teamIndia = teamRepository.save(Team.builder().name("India").shortName("IND").build());
        teamAustralia = teamRepository.save(Team.builder().name("Australia").shortName("AUS").build());

        rohit = playerRepository.save(Player.builder().name("Rohit Sharma").role(PlayerRole.BATSMAN).team(teamIndia).build());
        kohli = playerRepository.save(Player.builder().name("Virat Kohli").role(PlayerRole.BATSMAN).team(teamIndia).build());
        gill = playerRepository.save(Player.builder().name("Shubman Gill").role(PlayerRole.BATSMAN).team(teamIndia).build());

        starc = playerRepository.save(Player.builder().name("Mitchell Starc").role(PlayerRole.BOWLER).team(teamAustralia).build());
        cummins = playerRepository.save(Player.builder().name("Pat Cummins").role(PlayerRole.BOWLER).team(teamAustralia).build());

        match = matchRepository.save(Match.builder()
                .teamA(teamIndia)
                .teamB(teamAustralia)
                .venue("MCG")
                .matchDate(LocalDateTime.now())
                .status(MatchStatus.LIVE)
                .totalOvers(20)
                .build());

        innings = inningsRepository.save(Innings.builder()
                .match(match)
                .battingTeam(teamIndia)
                .bowlingTeam(teamAustralia)
                .inningsNumber(1)
                .totalRuns(0)
                .totalWickets(0)
                .legalBalls(0)
                .status(InningsStatus.IN_PROGRESS)
                .build());
    }

    @Test
    @DisplayName("Test normal run scoring (4s, 6s, singles) & strike rotation")
    void testNormalRunScoring() {
        // Ball 0.1: Rohit hits 4
        BallRequest ball1 = BallRequest.builder()
                .strikerId(rohit.getId())
                .nonStrikerId(kohli.getId())
                .bowlerId(starc.getId())
                .runsOffBat(4)
                .extraType(ExtraType.NONE)
                .wicket(false)
                .build();

        ScoreboardResponse score1 = scoringService.recordBall(innings.getId(), ball1);
        assertEquals("4/0", score1.getScore());
        assertEquals("0.1", score1.getOvers());
        assertEquals("Rohit Sharma", score1.getStriker().getName());
        assertEquals(4, score1.getStriker().getRuns());
        assertEquals(1, score1.getStriker().getFours());

        // Ball 0.2: Rohit scores 1 (strike swaps to Kohli)
        BallRequest ball2 = BallRequest.builder()
                .strikerId(rohit.getId())
                .nonStrikerId(kohli.getId())
                .bowlerId(starc.getId())
                .runsOffBat(1)
                .extraType(ExtraType.NONE)
                .wicket(false)
                .build();

        ScoreboardResponse score2 = scoringService.recordBall(innings.getId(), ball2);
        assertEquals("5/0", score2.getScore());
        assertEquals("0.2", score2.getOvers());
        assertEquals("Virat Kohli", score2.getStriker().getName());
        assertEquals("Rohit Sharma", score2.getNonStriker().getName());
    }

    @Test
    @DisplayName("Test Wide delivery does not increment legal ball count")
    void testWideDelivery() {
        BallRequest wideBall = BallRequest.builder()
                .strikerId(rohit.getId())
                .nonStrikerId(kohli.getId())
                .bowlerId(starc.getId())
                .runsOffBat(0)
                .extraType(ExtraType.WIDE)
                .extraRuns(1)
                .wicket(false)
                .build();

        ScoreboardResponse response = scoringService.recordBall(innings.getId(), wideBall);

        assertEquals("1/0", response.getScore());
        assertEquals("0.0", response.getOvers()); // Still 0.0 overs
        assertEquals(1, response.getBowler().getWides());
        assertEquals(1, response.getBowler().getRunsConceded());
    }

    @Test
    @DisplayName("Test No-Ball adds penalty and credits batsman runs")
    void testNoBallDelivery() {
        // No ball with 4 runs from bat = 5 total runs (4 to batsman, 1 extra)
        BallRequest noBall = BallRequest.builder()
                .strikerId(rohit.getId())
                .nonStrikerId(kohli.getId())
                .bowlerId(starc.getId())
                .runsOffBat(4)
                .extraType(ExtraType.NO_BALL)
                .extraRuns(1)
                .wicket(false)
                .build();

        ScoreboardResponse response = scoringService.recordBall(innings.getId(), noBall);

        assertEquals("5/0", response.getScore());
        assertEquals("0.0", response.getOvers()); // No ball does not increase legal ball count
        assertEquals(4, response.getStriker().getRuns());
        assertEquals(1, response.getBowler().getNoBalls());
        assertEquals(5, response.getBowler().getRunsConceded());
    }

    @Test
    @DisplayName("Test Byes add to team score but not charged to bowler")
    void testByeDelivery() {
        BallRequest byeBall = BallRequest.builder()
                .strikerId(rohit.getId())
                .nonStrikerId(kohli.getId())
                .bowlerId(starc.getId())
                .runsOffBat(0)
                .extraType(ExtraType.BYE)
                .extraRuns(2)
                .wicket(false)
                .build();

        ScoreboardResponse response = scoringService.recordBall(innings.getId(), byeBall);

        assertEquals("2/0", response.getScore());
        assertEquals("0.1", response.getOvers());
        assertEquals(0, response.getStriker().getRuns()); // Batsman gets 0 runs
        assertEquals(1, response.getStriker().getBallsFaced()); // Faced 1 ball
        assertEquals(0, response.getBowler().getRunsConceded()); // Bowler charged 0 runs
    }

    @Test
    @DisplayName("Test Bowler Wicket updates wickets count and batsman state")
    void testWicketHandling() {
        BallRequest wicketBall = BallRequest.builder()
                .strikerId(rohit.getId())
                .nonStrikerId(kohli.getId())
                .bowlerId(starc.getId())
                .runsOffBat(0)
                .extraType(ExtraType.NONE)
                .wicket(true)
                .wicketType(WicketType.BOWLED)
                .dismissedPlayerId(rohit.getId())
                .build();

        ScoreboardResponse response = scoringService.recordBall(innings.getId(), wicketBall);

        assertEquals("0/1", response.getScore());
        assertEquals(1, response.getBowler().getWickets());
    }

    @Test
    @DisplayName("Test bowler cannot bowl consecutive overs")
    void testConsecutiveOverRestriction() {
        // Bowl 6 legal balls by Starc to complete over 1
        for (int i = 0; i < 6; i++) {
            scoringService.recordBall(innings.getId(), BallRequest.builder()
                    .strikerId(rohit.getId())
                    .nonStrikerId(kohli.getId())
                    .bowlerId(starc.getId())
                    .runsOffBat(0)
                    .extraType(ExtraType.NONE)
                    .wicket(false)
                    .build());
        }

        // Try to bowl ball 1 of over 2 by Starc again (should throw InvalidScoringException)
        BallRequest over2Ball1 = BallRequest.builder()
                .strikerId(kohli.getId())
                .nonStrikerId(rohit.getId())
                .bowlerId(starc.getId())
                .runsOffBat(1)
                .extraType(ExtraType.NONE)
                .wicket(false)
                .build();

        assertThrows(InvalidScoringException.class, () -> scoringService.recordBall(innings.getId(), over2Ball1));
    }
}
