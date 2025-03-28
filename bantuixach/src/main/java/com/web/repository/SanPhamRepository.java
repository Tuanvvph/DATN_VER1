package com.web.repository;

import com.web.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SanPhamRepository extends JpaRepository<SanPham, Long> {

    @Query(value = "select distinct s.* from VoucherSanPhamSPCT vc \n" +
            "inner join SanPhamChiTiet spct on spct.id = vc.sanPhamChiTiet_id\n" +
            "inner join SanPham s on s.id = spct.sanPham_id where vc.voucherSanPham_id = ?1", nativeQuery = true)
    List<SanPham> findSanPhamGiamGia(Long idGiamGiaSp);
}
