package com.web.repository;

import com.web.entity.SanPham;
import com.web.entity.VoucherSanPhamSPCT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface VoucherSanPhamSPCTRepository extends JpaRepository<VoucherSanPhamSPCT, Long> {

    @Query("select v from VoucherSanPhamSPCT v where v.voucherSanPham.id = ?1")
    List<VoucherSanPhamSPCT> findByVoucherSp(Long id);

    @Modifying
    @Transactional
    @Query("delete from VoucherSanPhamSPCT p where p.voucherSanPham.id = ?1")
    int deleteByVoucherSp(Long id);
}
