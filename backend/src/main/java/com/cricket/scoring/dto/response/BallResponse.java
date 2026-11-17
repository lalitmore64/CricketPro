package com.cricket.scoring.dto.response;

import com.cricket.scoring.enums.ExtraType;
import com.cricket.scoring.enums.WicketType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BallResponse {
    private Long id;
    private Long inningsId;
    private Integer overNumber;
    private Integer ballNumber;
    private Long strikerId;
    private String strikerName;
    private Long nonStrikerId;
    private String nonStrikerName;
    private Long bowlerId;
    private String bowlerName;
    private Integer runsOffBat;
    private Integer extraRuns;
    private Integer totalRuns;
    private ExtraType extraType;
    private Boolean wicket;
    private WicketType wicketType;
    private Long dismissedPlayerId;
    private String dismissedPlayerName;
    private Boolean isLegalDelivery;
    private LocalDateTime createdAt;
}
