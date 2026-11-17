package com.cricket.scoring.entity;

import com.cricket.scoring.enums.ExtraType;
import com.cricket.scoring.enums.WicketType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "balls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ball {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @Column(nullable = false)
    private Integer overNumber;

    @Column(nullable = false)
    private Integer ballNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "striker_id", nullable = false)
    private Player striker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "non_striker_id", nullable = false)
    private Player nonStriker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bowler_id", nullable = false)
    private Player bowler;

    @Column(nullable = false)
    private Integer runsOffBat;

    @Column(nullable = false)
    private Integer extraRuns;

    @Column(nullable = false)
    private Integer totalRuns;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExtraType extraType;

    @Column(nullable = false)
    private Boolean wicket;

    @Enumerated(EnumType.STRING)
    private WicketType wicketType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dismissed_player_id")
    private Player dismissedPlayer;

    @Column(nullable = false)
    private Boolean isLegalDelivery;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
