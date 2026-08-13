package com.cricket.scoring.service.impl;

import com.cricket.scoring.dto.response.AiSummaryResponse;
import com.cricket.scoring.dto.response.BattingStatResponse;
import com.cricket.scoring.dto.response.BowlingStatResponse;
import com.cricket.scoring.dto.response.InningsResponse;
import com.cricket.scoring.dto.response.MatchScorecardResponse;
import com.cricket.scoring.service.AiSummaryService;
import com.cricket.scoring.service.MatchService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
public class AiSummaryServiceImpl implements AiSummaryService {

    private static final Logger log = LoggerFactory.getLogger(AiSummaryServiceImpl.class);

    private final MatchService matchService;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${ai.api.key:demo-key}")
    private String apiKey;

    @Value("${ai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${ai.model:gpt-3.5-turbo}")
    private String model;

    public AiSummaryServiceImpl(MatchService matchService, ObjectMapper objectMapper) {
        this.matchService = matchService;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.create();
    }

    @Override
    public AiSummaryResponse generateMatchSummary(Long matchId) {
        MatchScorecardResponse scorecard = matchService.getMatchScorecard(matchId);

        // Try AI API generation if API Key is configured and not default
        if (apiKey != null && !apiKey.isBlank() && !"demo-key".equalsIgnoreCase(apiKey)) {
            try {
                return callAiApi(scorecard);
            } catch (Exception e) {
                log.warn("AI API call failed ({}). Falling back to rule-based match analytics engine.", e.getMessage());
            }
        }

        // Rule-based dynamic summary fallback
        return generateFallbackSummary(scorecard);
    }

    private AiSummaryResponse callAiApi(MatchScorecardResponse scorecard) throws Exception {
        String prompt = buildPrompt(scorecard);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", "You are an expert cricket analyst. Respond strictly in valid JSON with keys: summary (String), highlights (List of Strings), turningPoints (List of Strings), playerInsights (List of Strings)."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
        );

        String responseJson = restClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(responseJson);
        String content = root.path("choices").get(0).path("message").path("content").asText();

        return objectMapper.readValue(content, AiSummaryResponse.class);
    }

    private String buildPrompt(MatchScorecardResponse scorecard) {
        StringBuilder sb = new StringBuilder();
        sb.append("Match: ").append(scorecard.getTeamA()).append(" vs ").append(scorecard.getTeamB()).append("\n");
        sb.append("Venue: ").append(scorecard.getVenue()).append("\n");
        sb.append("Status: ").append(scorecard.getMatchStatus()).append("\n");

        for (InningsResponse innings : scorecard.getInningsScorecards()) {
            sb.append("Innings ").append(innings.getInningsNumber()).append(": ")
                    .append(innings.getBattingTeam().getName()).append(" scored ")
                    .append(innings.getTotalRuns()).append("/").append(innings.getTotalWickets())
                    .append(" in ").append(innings.getOvers()).append(" overs.\n");
        }
        return sb.toString();
    }

    private AiSummaryResponse generateFallbackSummary(MatchScorecardResponse scorecard) {
        List<InningsResponse> inningsList = scorecard.getInningsScorecards();
        List<String> highlights = new ArrayList<>();
        List<String> turningPoints = new ArrayList<>();
        List<String> playerInsights = new ArrayList<>();

        if (inningsList.isEmpty()) {
            return AiSummaryResponse.builder()
                    .summary("Match between " + scorecard.getTeamA() + " and " + scorecard.getTeamB() + " at " + scorecard.getVenue() + " has not recorded any deliveries yet.")
                    .highlights(List.of("Match scheduled for " + scorecard.getMatchDate()))
                    .turningPoints(List.of("Awaiting toss and innings start"))
                    .playerInsights(List.of("No player stats available yet"))
                    .build();
        }

        InningsResponse innings1 = inningsList.get(0);
        InningsResponse innings2 = inningsList.size() > 1 ? inningsList.get(1) : null;

        // Collect Top Batsmen
        List<BattingStatResponse> allBatsmen = new ArrayList<>();
        for (InningsResponse inn : inningsList) {
            if (inn.getBattingScorecard() != null) {
                allBatsmen.addAll(inn.getBattingScorecard());
            }
        }
        allBatsmen.sort(Comparator.comparingInt(BattingStatResponse::getRuns).reversed());

        // Collect Top Bowlers
        List<BowlingStatResponse> allBowlers = new ArrayList<>();
        for (InningsResponse inn : inningsList) {
            if (inn.getBowlingScorecard() != null) {
                allBowlers.addAll(inn.getBowlingScorecard());
            }
        }
        allBowlers.sort(Comparator.comparingInt(BowlingStatResponse::getWickets).reversed()
                .thenComparingInt(BowlingStatResponse::getRunsConceded));

        // Generate Highlights & Insights
        if (!allBatsmen.isEmpty()) {
            BattingStatResponse topBat = allBatsmen.get(0);
            highlights.add(topBat.getName() + " top-scored with " + topBat.getRuns() + " runs (" + topBat.getBallsFaced() + " balls, " + topBat.getFours() + "x4, " + topBat.getSixes() + "x6).");
            playerInsights.add(topBat.getName() + " maintained a strong strike rate of " + String.format("%.2f", topBat.getStrikeRate()) + ".");
        }

        if (!allBowlers.isEmpty()) {
            BowlingStatResponse topBowl = allBowlers.get(0);
            highlights.add(topBowl.getName() + " led the bowling attack with figures of " + topBowl.getWickets() + " wickets for " + topBowl.getRunsConceded() + " runs in " + topBowl.getOvers() + " overs.");
            playerInsights.add(topBowl.getName() + " bowled with an economy rate of " + String.format("%.2f", topBowl.getEconomy()) + ".");
        }

        String summaryText;
        if (innings2 != null) {
            int runs1 = innings1.getTotalRuns();
            int runs2 = innings2.getTotalRuns();
            if (runs2 > runs1) {
                int wicketsLeft = 10 - innings2.getTotalWickets();
                summaryText = innings2.getBattingTeam().getName() + " defeated " + innings1.getBattingTeam().getName() + " by " + wicketsLeft + " wickets at " + scorecard.getVenue() + ".";
                turningPoints.add(innings2.getBattingTeam().getName() + " successfully chased down the target of " + (runs1 + 1) + " runs.");
            } else if (runs1 > runs2) {
                int runDiff = runs1 - runs2;
                summaryText = innings1.getBattingTeam().getName() + " defeated " + innings2.getBattingTeam().getName() + " by " + runDiff + " runs at " + scorecard.getVenue() + ".";
                turningPoints.add(innings1.getBattingTeam().getName() + " defended their total of " + runs1 + " runs.");
            } else {
                summaryText = "The match between " + scorecard.getTeamA() + " and " + scorecard.getTeamB() + " ended in a thrilling TIE!";
                turningPoints.add("Both teams finished level on " + runs1 + " runs.");
            }
        } else {
            summaryText = innings1.getBattingTeam().getName() + " posted " + innings1.getTotalRuns() + "/" + innings1.getTotalWickets() + " in " + innings1.getOvers() + " overs against " + innings1.getBowlingTeam().getName() + ".";
            turningPoints.add(innings1.getBattingTeam().getName() + " set the initial target in the first innings.");
        }

        if (turningPoints.isEmpty()) {
            turningPoints.add("Crucial middle overs dictated the tempo of the match.");
        }

        return AiSummaryResponse.builder()
                .summary(summaryText)
                .highlights(highlights)
                .turningPoints(turningPoints)
                .playerInsights(playerInsights)
                .build();
    }
}
