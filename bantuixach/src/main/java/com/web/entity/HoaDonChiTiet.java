package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "HoaDonChiTiet")
@Getter
@Setter
public class HoaDonChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Integer soLuong;

    private Double gia;

    @ManyToOne
    private HoaDon hoaDon;

    @ManyToOne
    private SanPhamChiTiet sanPhamChiTiet;
}
