package com.cricket.scoring.controller;

import com.cricket.scoring.dto.response.InningsResponse;
import com.cricket.scoring.dto.response.ScoreboardResponse;
import com.cricket.scoring.service.MatchService;
import com.cricket.scoring.service.ScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/innings")
@RequiredArgsConstructor
public class InningsController {

    private final MatchService matchService;
    private final ScoringService scoringService;

    @GetMapping("/{inningsId}")
    public ResponseEntity<InningsResponse> getInningsById(@PathVariable Long inningsId) {
        return ResponseEntity.ok(matchService.getInningsById(inningsId));
    }

    @GetMapping("/{inningsId}/scorecard")
    public ResponseEntity<ScoreboardResponse> getInningsScorecard(@PathVariable Long inningsId) {
        return ResponseEntity.ok(scoringService.getScoreboard(inningsId));
    }
}
