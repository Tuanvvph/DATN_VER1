package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "SanPham")
@Getter
@Setter
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String tenSanPham;

    private Date createdAt;

    private Date updatedAt;

    private String anh;

    private Double gia;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String moTa;

    @ManyToOne
    private LoaiSanPham loaiSanPham;

    @OneToMany(mappedBy = "sanPham", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = {"sanPham"})
    private List<SanPhamChiTiet> sanPhamChiTiets;
}
