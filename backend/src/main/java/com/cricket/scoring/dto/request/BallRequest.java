package com.cricket.scoring.dto.request;

import com.cricket.scoring.enums.ExtraType;
import com.cricket.scoring.enums.WicketType;
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
public class BallRequest {

    @NotNull(message = "Striker ID is required")
    private Long strikerId;

    @NotNull(message = "Non-striker ID is required")
    private Long nonStrikerId;

    @NotNull(message = "Bowler ID is required")
    private Long bowlerId;

    @NotNull(message = "Runs off bat is required")
    @Min(value = 0, message = "Runs off bat cannot be negative")
    private Integer runsOffBat;

    @NotNull(message = "Extra type is required")
    private ExtraType extraType;

    @Min(value = 0, message = "Extra runs cannot be negative")
    @Builder.Default
    private Integer extraRuns = 0;

    @NotNull(message = "Wicket boolean indicator is required")
    private Boolean wicket;

    private WicketType wicketType;

    private Long dismissedPlayerId;
}
