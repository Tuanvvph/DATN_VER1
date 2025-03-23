package com.web.repository;

import com.web.entity.LoaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LoaiSanPhamRepository extends JpaRepository<LoaiSanPham, Long> {

}
