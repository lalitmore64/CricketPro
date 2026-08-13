package com.cricket.scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSummaryResponse {
    private String summary;
    private List<String> highlights;
    private List<String> turningPoints;
    private List<String> playerInsights;
}
