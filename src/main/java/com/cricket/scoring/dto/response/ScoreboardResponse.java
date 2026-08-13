package com.cricket.scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreboardResponse {
    private Long inningsId;
    private String score;
    private String overs;
    private BattingStatResponse striker;
    private BattingStatResponse nonStriker;
    private BowlingStatResponse bowler;
    private BallResponse lastBall;
}
