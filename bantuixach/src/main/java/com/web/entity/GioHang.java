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

    private Double tongGia;

    private Integer tongSoLuong;

    private Date createdAt;

    private Date updatedAt;

    @ManyToOne
    private TaiKhoan taiKhoan;
}
