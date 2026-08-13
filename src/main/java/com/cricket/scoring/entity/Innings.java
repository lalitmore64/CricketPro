package com.cricket.scoring.entity;

import com.cricket.scoring.enums.InningsStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "innings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Innings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batting_team_id", nullable = false)
    private Team battingTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bowling_team_id", nullable = false)
    private Team bowlingTeam;

    @Column(nullable = false)
    private Integer inningsNumber;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalRuns = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalWickets = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer legalBalls = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InningsStatus status;

    @OneToMany(mappedBy = "innings", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Ball> balls = new ArrayList<>();

    @OneToMany(mappedBy = "innings", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BattingScorecard> battingScorecards = new ArrayList<>();

    @OneToMany(mappedBy = "innings", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BowlingScorecard> bowlingScorecards = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.totalRuns == null) this.totalRuns = 0;
        if (this.totalWickets == null) this.totalWickets = 0;
        if (this.legalBalls == null) this.legalBalls = 0;
        if (this.status == null) this.status = InningsStatus.IN_PROGRESS;
    }
}
