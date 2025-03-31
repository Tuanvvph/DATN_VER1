package com.web.repository;

import com.web.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HoaDonRepository extends JpaRepository<HoaDon, Long> {

    @Query("select h from HoaDon h where h.taiKhoan.id = ?1")
    List<HoaDon> findByUser(Long userId);
}
