package com.cricket.scoring.exception;

public class MatchAlreadyCompletedException extends RuntimeException {
    public MatchAlreadyCompletedException(String message) {
        super(message);
    }
}
