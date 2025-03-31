package com.web.repository;

import com.web.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Long> {

    @Query("select h from HoaDonChiTiet h where h.hoaDon.id = ?1")
    List<HoaDonChiTiet> findByHoaDon(Long idHoaDon);
}
