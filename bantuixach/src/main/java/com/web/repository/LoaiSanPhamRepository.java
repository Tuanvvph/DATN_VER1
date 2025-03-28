package com.web.repository;

import com.web.dto.LoaiSanPhamDto;
import com.web.entity.LoaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LoaiSanPhamRepository extends JpaRepository<LoaiSanPham, Long> {

    @Query(value = "select l.tenLoaiSanPham,\n" +
            "(select sum(hc.soLuong) from HoaDonChiTiet hc inner join SanPhamChiTiet spct on spct.id = hc.sanPhamChiTiet_id\n" +
            "inner join SanPham s on s.id = spct.sanPham_id where s.loaiSanPham_id = l.id) \n" +
            "as soluong from LoaiSanPham l order by soluong desc", nativeQuery = true)
    public List<LoaiSanPhamDto> findSoLuongBan();
}
