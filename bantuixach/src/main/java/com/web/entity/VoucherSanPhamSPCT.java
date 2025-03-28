package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "VoucherSanPhamSPCT")
@Getter
@Setter
public class VoucherSanPhamSPCT {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    private SanPhamChiTiet sanPhamChiTiet;

    @ManyToOne
    private VoucherSanPham voucherSanPham;
}
