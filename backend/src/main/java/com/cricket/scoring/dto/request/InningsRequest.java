package com.cricket.scoring.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InningsRequest {

    @NotNull(message = "Batting Team ID is required")
    private Long battingTeamId;

    @NotNull(message = "Bowling Team ID is required")
    private Long bowlingTeamId;

    @NotNull(message = "Innings number is required")
    @Min(value = 1, message = "Innings number must be at least 1")
    private Integer inningsNumber;
}
