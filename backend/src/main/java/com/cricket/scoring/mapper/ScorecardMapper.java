package com.cricket.scoring.mapper;

import com.cricket.scoring.dto.response.BattingStatResponse;
import com.cricket.scoring.dto.response.BowlingStatResponse;
import com.cricket.scoring.entity.BattingScorecard;
import com.cricket.scoring.entity.BowlingScorecard;
import com.cricket.scoring.util.OverCalculator;

public class ScorecardMapper {

    private ScorecardMapper() {}

    public static BattingStatResponse toBattingResponse(BattingScorecard card) {
        if (card == null) return null;
        return BattingStatResponse.builder()
                .id(card.getPlayer().getId())
                .name(card.getPlayer().getName())
                .runs(card.getRuns())
                .ballsFaced(card.getBallsFaced())
                .fours(card.getFours())
                .sixes(card.getSixes())
                .strikeRate(OverCalculator.calculateStrikeRate(card.getRuns(), card.getBallsFaced()))
                .isOut(card.getIsOut())
                .dismissalType(card.getDismissalType())
                .bowlerName(card.getBowler() != null ? card.getBowler().getName() : null)
                .build();
    }

    public static BowlingStatResponse toBowlingResponse(BowlingScorecard card) {
        if (card == null) return null;
        return BowlingStatResponse.builder()
                .id(card.getPlayer().getId())
                .name(card.getPlayer().getName())
                .overs(OverCalculator.formatOvers(card.getLegalBalls()))
                .runsConceded(card.getRunsConceded())
                .wickets(card.getWickets())
                .wides(card.getWides())
                .noBalls(card.getNoBalls())
                .economy(OverCalculator.calculateEconomy(card.getRunsConceded(), card.getLegalBalls()))
                .build();
    }
}
