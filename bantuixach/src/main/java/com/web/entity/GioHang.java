package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "GioHang")
@Getter
@Setter
public class GioHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Integer soLuong;

    private Date createdAt;

    @ManyToOne
    private TaiKhoan taiKhoan;

    @ManyToOne
    private SanPhamChiTiet sanPhamChiTiet;
}
