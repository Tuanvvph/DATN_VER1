package com.web.entity;

import com.web.enums.LoaiGiamGia;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "VoucherSanPham")
@Getter
@Setter
public class VoucherSanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Date ngayKetThuc;

    private Float giaTriGiam;

    private Boolean daHoanThanh = false;

    @Enumerated(EnumType.STRING)
    private LoaiGiamGia loaiGiamGia;
}
