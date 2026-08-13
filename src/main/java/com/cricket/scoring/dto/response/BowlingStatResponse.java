package com.cricket.scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BowlingStatResponse {
    private Long id;
    private String name;
    private String overs;
    private Integer runsConceded;
    private Integer wickets;
    private Integer wides;
    private Integer noBalls;
    private Double economy;
}
