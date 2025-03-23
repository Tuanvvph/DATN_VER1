package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "TaiKhoan")
@Getter
@Setter
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String email;

    private String password;

    private String hoTen;

    private String soDienThoai;

    private Boolean trangThai;

    private Date createdAt;

    private String anh;

    @ManyToOne
    private Quyen quyen;
}

