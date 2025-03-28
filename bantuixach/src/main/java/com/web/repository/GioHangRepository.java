package com.web.repository;

import com.web.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface GioHangRepository extends JpaRepository<GioHang, Long> {

    @Query("select count(g.id) from GioHang g where g.taiKhoan.id = ?1")
    Long countByUser(Long userId);

    @Query("select g from GioHang g where g.taiKhoan.id = ?1 and g.sanPhamChiTiet.id = ?2")
    Optional<GioHang> findByUserAndCtsp(Long userId, Long ctspId);

    @Query("select g from GioHang g where g.taiKhoan.id = ?1")
    List<GioHang> findByUser(Long userId);

    @Modifying
    @Transactional
    @Query("delete from GioHang p where p.taiKhoan.id = ?1")
    int deleteByTaiKhoan(Long tkId);
}
