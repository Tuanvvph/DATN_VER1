package com.web.repository;

import com.web.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTiet, Long> {

    @Query("select s from SanPhamChiTiet s where s.mauSac.id = ?1 and s.kichThuoc.id = ?2 and s.sanPham.id = ?3")
    Optional<SanPhamChiTiet> findByKichThuocMauSacAndSp(Long idMau, Long idKichThuoc, Long idSp);

    @Query("select s from SanPhamChiTiet s where s.mauSac.id = ?1 and s.kichThuoc.id = ?2 and s.sanPham.id = ?3 and s.id <> ?4")
    Optional<SanPhamChiTiet> findByKichThuocMauSacAndSpNot(Long idMau, Long idKichThuoc, Long idSp, Long id);

    @Query("select s from SanPhamChiTiet s where s.sanPham.id = ?1")
    List<SanPhamChiTiet> findBySanPham(Long idSp);

//    @Query("SELECT p FROM SanPhamChiTiet p WHERE p.sanPham.id IN :sanPhamIds")
//    List<SanPhamChiTiet> findProductsByCategoryIds(@Param("sanPhamIds") List<Long> sanPhamIds);

    @Query("SELECT p FROM SanPhamChiTiet p WHERE p.sanPham.id IN ?1")
    List<SanPhamChiTiet> findBySanPhamIds(List<Long> sanPhamIds);
}
