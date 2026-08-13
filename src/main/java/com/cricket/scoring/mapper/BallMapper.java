package com.cricket.scoring.mapper;

import com.cricket.scoring.dto.response.BallResponse;
import com.cricket.scoring.entity.Ball;

public class BallMapper {

    private BallMapper() {}

    public static BallResponse toResponse(Ball ball) {
        if (ball == null) return null;

        return BallResponse.builder()
                .id(ball.getId())
                .inningsId(ball.getInnings() != null ? ball.getInnings().getId() : null)
                .overNumber(ball.getOverNumber())
                .ballNumber(ball.getBallNumber())
                .strikerId(ball.getStriker() != null ? ball.getStriker().getId() : null)
                .strikerName(ball.getStriker() != null ? ball.getStriker().getName() : null)
                .nonStrikerId(ball.getNonStriker() != null ? ball.getNonStriker().getId() : null)
                .nonStrikerName(ball.getNonStriker() != null ? ball.getNonStriker().getName() : null)
                .bowlerId(ball.getBowler() != null ? ball.getBowler().getId() : null)
                .bowlerName(ball.getBowler() != null ? ball.getBowler().getName() : null)
                .runsOffBat(ball.getRunsOffBat())
                .extraRuns(ball.getExtraRuns())
                .totalRuns(ball.getTotalRuns())
                .extraType(ball.getExtraType())
                .wicket(ball.getWicket())
                .wicketType(ball.getWicketType())
                .dismissedPlayerId(ball.getDismissedPlayer() != null ? ball.getDismissedPlayer().getId() : null)
                .dismissedPlayerName(ball.getDismissedPlayer() != null ? ball.getDismissedPlayer().getName() : null)
                .isLegalDelivery(ball.getIsLegalDelivery())
                .createdAt(ball.getCreatedAt())
                .build();
    }
}
