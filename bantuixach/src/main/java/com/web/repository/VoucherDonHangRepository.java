package com.web.repository;

import com.web.entity.VoucherDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VoucherDonHangRepository extends JpaRepository<VoucherDonHang, Long> {

    @Query("select v from VoucherDonHang v where v.code = ?1")
    Optional<VoucherDonHang> findByCode(String code);

    @Query("select v from VoucherDonHang v where v.code = ?1 and v.id <> ?2")
    Optional<VoucherDonHang> findByCode(String code, Long id);
}
