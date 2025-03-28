package com.web.repository;

import com.web.entity.LichSuThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LichSuThanhToanRepository extends JpaRepository<LichSuThanhToan, Long> {

    @Query("select h from LichSuThanhToan h where h.requestId = ?1")
    Optional<LichSuThanhToan> findByRequestId(String requestId);
}
