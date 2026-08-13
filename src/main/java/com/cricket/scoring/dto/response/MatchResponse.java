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
public class MatchResponse {
    private Long id;
    private TeamResponse teamA;
    private TeamResponse teamB;
    private String venue;
    private LocalDateTime matchDate;
    private MatchStatus status;
    private Integer totalOvers;
    private LocalDateTime createdAt;
    private List<InningsResponse> innings;
}
