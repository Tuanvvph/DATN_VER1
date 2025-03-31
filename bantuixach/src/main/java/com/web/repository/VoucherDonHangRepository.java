package com.web.repository;

import com.web.entity.VoucherDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface VoucherDonHangRepository extends JpaRepository<VoucherDonHang, Long> {

    @Query("select v from VoucherDonHang v where v.code = ?1")
    Optional<VoucherDonHang> findByCode(String code);

    @Query("select v from VoucherDonHang v where v.code = ?1 and v.id <> ?2")
    Optional<VoucherDonHang> findByCode(String code, Long id);

    @Query("select v from VoucherDonHang v where v.donToiThieu <= ?1 and v.ngayBatDau <= ?2 and v.ngayKetThuc >= ?2")
    List<VoucherDonHang> voucherKhaDung(Double tongCart, Date date);
}
