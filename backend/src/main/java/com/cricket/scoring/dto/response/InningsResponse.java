package com.cricket.scoring.dto.response;

import com.cricket.scoring.enums.InningsStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InningsResponse {
    private Long id;
    private Long matchId;
    private TeamResponse battingTeam;
    private TeamResponse bowlingTeam;
    private Integer inningsNumber;
    private Integer totalRuns;
    private Integer totalWickets;
    private String overs;
    private Integer legalBalls;
    private InningsStatus status;
    private List<BattingStatResponse> battingScorecard;
    private List<BowlingStatResponse> bowlingScorecard;
}
