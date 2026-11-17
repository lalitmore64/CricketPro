package com.cricket.scoring.dto.response;

import com.cricket.scoring.enums.PlayerRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponse {
    private Long id;
    private String name;
    private PlayerRole role;
    private Long teamId;
    private String teamName;
}
