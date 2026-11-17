package com.cricket.scoring.dto.response;

import com.cricket.scoring.enums.WicketType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BattingStatResponse {
    private Long id;
    private String name;
    private Integer runs;
    private Integer ballsFaced;
    private Integer fours;
    private Integer sixes;
    private Double strikeRate;
    private Boolean isOut;
    private WicketType dismissalType;
    private String bowlerName;
}
