package com.cricket.scoring.controller;

import com.cricket.scoring.dto.request.InningsRequest;
import com.cricket.scoring.dto.request.MatchRequest;
import com.cricket.scoring.dto.response.InningsResponse;
import com.cricket.scoring.dto.response.MatchResponse;
import com.cricket.scoring.dto.response.MatchScorecardResponse;
import com.cricket.scoring.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@Valid @RequestBody MatchRequest request) {
        MatchResponse response = matchService.createMatch(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponse> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<MatchResponse> startMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.startMatch(id));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<MatchResponse> completeMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.completeMatch(id));
    }

    @PostMapping("/{matchId}/innings")
    public ResponseEntity<InningsResponse> createInnings(@PathVariable Long matchId,
                                                         @Valid @RequestBody InningsRequest request) {
        InningsResponse response = matchService.createInnings(matchId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{matchId}/scorecard")
    public ResponseEntity<MatchScorecardResponse> getMatchScorecard(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.getMatchScorecard(matchId));
    }
}
