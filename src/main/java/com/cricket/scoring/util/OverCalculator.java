package com.cricket.scoring.util;

public class OverCalculator {

    private OverCalculator() {
    }

    /**
     * Converts legal balls count to cricket overs string representation.
     * E.g. 0 -> "0.0", 5 -> "0.5", 6 -> "1.0", 7 -> "1.1"
     */
    public static String formatOvers(int legalBalls) {
        int overs = legalBalls / 6;
        int balls = legalBalls % 6;
        return overs + "." + balls;
    }

    /**
     * Calculates economy rate given runs conceded and legal balls.
     */
    public static double calculateEconomy(int runsConceded, int legalBalls) {
        if (legalBalls == 0) {
            return 0.0;
        }
        double overs = legalBalls / 6.0;
        double economy = runsConceded / overs;
        return Math.round(economy * 100.0) / 100.0;
    }

    /**
     * Calculates strike rate given runs scored and balls faced.
     */
    public static double calculateStrikeRate(int runs, int ballsFaced) {
        if (ballsFaced == 0) {
            return 0.0;
        }
        double strikeRate = ((double) runs / ballsFaced) * 100.0;
        return Math.round(strikeRate * 100.0) / 100.0;
    }
}
