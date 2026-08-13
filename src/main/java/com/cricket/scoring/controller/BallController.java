package com.cricket.scoring.controller;

import com.cricket.scoring.dto.request.BallRequest;
import com.cricket.scoring.dto.response.BallResponse;
import com.cricket.scoring.dto.response.ScoreboardResponse;
import com.cricket.scoring.service.ScoringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/innings/{inningsId}/balls")
@RequiredArgsConstructor
public class BallController {

    private final ScoringService scoringService;

    @PostMapping
    public ResponseEntity<ScoreboardResponse> recordBall(@PathVariable Long inningsId,
                                                         @Valid @RequestBody BallRequest request) {
        ScoreboardResponse response = scoringService.recordBall(inningsId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BallResponse>> getBallHistory(@PathVariable Long inningsId) {
        return ResponseEntity.ok(scoringService.getBallHistory(inningsId));
    }
}
