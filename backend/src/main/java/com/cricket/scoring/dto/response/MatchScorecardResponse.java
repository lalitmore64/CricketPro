package com.cricket.scoring.dto.response;

import com.cricket.scoring.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchScorecardResponse {
    private Long matchId;
    private String teamA;
    private String teamB;
    private String venue;
    private LocalDateTime matchDate;
    private MatchStatus matchStatus;
    private Integer totalOvers;
    private List<InningsResponse> inningsScorecards;
    private ScoreboardResponse currentScoreboard;
    private List<BallResponse> ballHistory;
}
