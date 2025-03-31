package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "DiaChi")
@Getter
@Setter
public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String hoTen;

    private String soDienThoai;

    private String chiTiet;

    private String diaChi;

    private String maXa;

    private String maHuyen;

    private String maTinh;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne
    private TaiKhoan taiKhoan;
}
