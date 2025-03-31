package com.web.repository;

import com.web.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaChiRepository extends JpaRepository<DiaChi, Long> {

    @Query("select d from DiaChi d where d.taiKhoan.id = ?1")
    List<DiaChi> findByUser(Long userId);
}
