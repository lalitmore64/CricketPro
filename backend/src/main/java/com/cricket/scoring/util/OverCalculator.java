package com.cricket.scoring.util;

public class OverCalculator {

    private OverCalculator() {
    }

    public static String formatOvers(int legalBalls) {
        int overs = legalBalls / 6;
        int balls = legalBalls % 6;
        return overs + "." + balls;
    }

    public static double calculateEconomy(int runsConceded, int legalBalls) {
        if (legalBalls == 0) {
            return 0.0;
        }
        double overs = legalBalls / 6.0;
        double economy = runsConceded / overs;
        return Math.round(economy * 100.0) / 100.0;
    }

    public static double calculateStrikeRate(int runs, int ballsFaced) {
        if (ballsFaced == 0) {
            return 0.0;
        }
        double strikeRate = ((double) runs / ballsFaced) * 100.0;
        return Math.round(strikeRate * 100.0) / 100.0;
    }
}
