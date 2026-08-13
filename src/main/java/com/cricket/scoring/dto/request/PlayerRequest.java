package com.cricket.scoring.dto.request;

import com.cricket.scoring.enums.PlayerRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerRequest {

    @NotBlank(message = "Player name is required")
    @Size(min = 2, max = 50, message = "Player name must be between 2 and 50 characters")
    private String name;

    @NotNull(message = "Player role is required")
    private PlayerRole role;

    @NotNull(message = "Team ID is required")
    private Long teamId;
}
