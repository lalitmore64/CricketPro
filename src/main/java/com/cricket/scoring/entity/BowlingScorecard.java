package com.cricket.scoring.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bowling_scorecards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BowlingScorecard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(nullable = false)
    @Builder.Default
    private Integer legalBalls = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer runsConceded = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer wickets = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer wides = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer noBalls = 0;
}
