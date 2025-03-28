package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "DanhGia")
@Getter
@Setter
public class DanhGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String noiDung;

    private Float danhGia;

    private LocalDateTime ngayDang;

    @ManyToOne
    private SanPham sanPham;

    @ManyToOne
    private TaiKhoan taiKhoan;
}
