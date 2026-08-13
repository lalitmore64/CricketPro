package com.cricket.scoring.service;

import com.cricket.scoring.dto.request.BallRequest;
import com.cricket.scoring.dto.response.BallResponse;
import com.cricket.scoring.dto.response.ScoreboardResponse;

import java.util.List;

public interface ScoringService {
    ScoreboardResponse recordBall(Long inningsId, BallRequest request);
    ScoreboardResponse getScoreboard(Long inningsId);
    List<BallResponse> getBallHistory(Long inningsId);
}
