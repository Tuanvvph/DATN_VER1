package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "SanPhamChiTiet")
@Getter
@Setter
public class SanPhamChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Double gia;

    private Double giaCu;

    private Integer soLuong;

    private String anh;

    @ManyToOne
    private MauSac mauSac;

    @ManyToOne
    private KichThuoc kichThuoc;

    @ManyToOne
    private SanPham sanPham;
}
