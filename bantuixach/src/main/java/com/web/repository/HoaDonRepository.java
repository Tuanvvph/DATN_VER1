package com.web.repository;

import com.web.entity.HoaDon;
import com.web.enums.LoaiThanhToan;
import com.web.enums.TrangThai;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;

public interface HoaDonRepository extends JpaRepository<HoaDon, Long> {

    @Query("select h from HoaDon h where h.taiKhoan.id = ?1")
    List<HoaDon> findByUser(Long userId);

    @Query(value = "select h.* from HoaDon h where CAST(h.createdAt as DATE) >= ?1 and CAST(h.createdAt as DATE) <= ?2", nativeQuery = true)
    List<HoaDon> findByDate(Date from, Date to);

    @Query(value = "select h.* from HoaDon h where CAST(h.createdAt as DATE) >= ?1 and CAST(h.createdAt as DATE) <= ?2 and h.trangThai = ?3", nativeQuery = true)
    List<HoaDon> findByDateAndStatus(Date from, Date to, String trangThai);

    @Query(value = "select h.* from HoaDon h where CAST(h.createdAt as DATE) >= ?1 and CAST(h.createdAt as DATE) <= ?2 and h.loaiThanhToan = ?3", nativeQuery = true)
    List<HoaDon> findByDateAndPaytype(Date from, Date to, String loaiThanhToan);

    @Query(value = "select h.* from HoaDon h where CAST(h.createdAt as DATE) >= ?1 and CAST(h.createdAt as DATE) <= ?2 and h.loaiThanhToan = ?3 and h.trangThai = ?4", nativeQuery = true)
    List<HoaDon> findByDateAndPaytypeAndStatus(Date from, Date to, String loaiThanhToan, String trangThai);

    @Query(value = "select sum(i.tongGia) from HoaDon i where Month(i.createdAt) = ?1 and Year(i.createdAt) = ?2 and (i.loaiThanhToan != 'COD' or i.trangThai = 'DA_NHAN' or i.loaiHoaDon = 'TAI_QUAY')", nativeQuery = true)
    public Double calDt(Integer thang, Integer month);

    @Query(value = "select count(h.id) from HoaDon h where CAST(h.createdAt as DATE) = ?1", nativeQuery = true)
    Long soDonHomNay(Date date);
}
