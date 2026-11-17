package com.cricket.scoring.service;

import com.cricket.scoring.dto.request.InningsRequest;
import com.cricket.scoring.dto.request.MatchRequest;
import com.cricket.scoring.dto.response.InningsResponse;
import com.cricket.scoring.dto.response.MatchResponse;
import com.cricket.scoring.dto.response.MatchScorecardResponse;

import java.util.List;

public interface MatchService {
    MatchResponse createMatch(MatchRequest request);
    List<MatchResponse> getAllMatches();
    MatchResponse getMatchById(Long id);
    MatchResponse startMatch(Long matchId);
    MatchResponse completeMatch(Long matchId);

    InningsResponse createInnings(Long matchId, InningsRequest request);
    InningsResponse getInningsById(Long inningsId);
    MatchScorecardResponse getMatchScorecard(Long matchId);
}
