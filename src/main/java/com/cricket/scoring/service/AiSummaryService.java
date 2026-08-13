package com.cricket.scoring.service;

import com.cricket.scoring.dto.response.AiSummaryResponse;

public interface AiSummaryService {
    AiSummaryResponse generateMatchSummary(Long matchId);
}
