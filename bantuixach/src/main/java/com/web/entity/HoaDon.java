package com.web.entity;

import com.web.enums.LoaiHoaDon;
import com.web.enums.LoaiThanhToan;
import com.web.enums.TrangThai;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "HoaDon")
@Getter
@Setter
public class HoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Double tongGia;

    private Double phiShip;

    @Enumerated(EnumType.STRING)
    private TrangThai trangThai;

    @Enumerated(EnumType.STRING)
    private LoaiHoaDon loaiHoaDon;

    @Enumerated(EnumType.STRING)
    private LoaiThanhToan loaiThanhToan;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String diaChi;

    private String ghiChu;

    private String hoTen;

    private String soDienThoai;

    @ManyToOne
    private TaiKhoan taiKhoan;

    @ManyToOne
    private VoucherDonHang voucherDonHang;
}
