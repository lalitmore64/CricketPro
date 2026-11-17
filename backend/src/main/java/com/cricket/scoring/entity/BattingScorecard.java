package com.cricket.scoring.entity;

import com.cricket.scoring.enums.WicketType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batting_scorecards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BattingScorecard {

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
    private Integer runs = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer ballsFaced = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer fours = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer sixes = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isOut = false;

    @Enumerated(EnumType.STRING)
    private WicketType dismissalType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bowler_id")
    private Player bowler;
}
