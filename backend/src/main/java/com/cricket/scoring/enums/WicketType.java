package com.cricket.scoring.enums;

public enum WicketType {
    BOWLED(true),
    CAUGHT(true),
    LBW(true),
    RUN_OUT(false),
    STUMPED(true),
    HIT_WICKET(true),
    RETIRED_HURT(false);

    private final boolean bowlerWicket;

    WicketType(boolean bowlerWicket) {
        this.bowlerWicket = bowlerWicket;
    }

    public boolean isBowlerWicket() {
        return bowlerWicket;
    }
}
