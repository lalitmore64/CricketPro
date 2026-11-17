package com.cricket.scoring.repository;

import com.cricket.scoring.entity.Ball;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BallRepository extends JpaRepository<Ball, Long> {
    List<Ball> findByInningsIdOrderByIdAsc(Long inningsId);
    Optional<Ball> findTopByInningsIdOrderByIdDesc(Long inningsId);
}
