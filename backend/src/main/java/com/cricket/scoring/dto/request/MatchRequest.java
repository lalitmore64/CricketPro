package com.cricket.scoring.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {

    @NotNull(message = "Team A ID is required")
    private Long teamAId;

    @NotNull(message = "Team B ID is required")
    private Long teamBId;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Match date is required")
    @FutureOrPresent(message = "Match date must be in the present or future")
    private LocalDateTime matchDate;

    @NotNull(message = "Total overs is required")
    @Min(value = 1, message = "Total overs must be at least 1")
    private Integer totalOvers;
}
