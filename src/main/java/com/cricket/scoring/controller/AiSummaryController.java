package com.cricket.scoring.controller;

import com.cricket.scoring.dto.response.AiSummaryResponse;
import com.cricket.scoring.service.AiSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches/{matchId}/generate-summary")
@RequiredArgsConstructor
public class AiSummaryController {

    private final AiSummaryService aiSummaryService;

    @PostMapping
    public ResponseEntity<AiSummaryResponse> generateSummary(@PathVariable Long matchId) {
        AiSummaryResponse summary = aiSummaryService.generateMatchSummary(matchId);
        return ResponseEntity.ok(summary);
    }
}
