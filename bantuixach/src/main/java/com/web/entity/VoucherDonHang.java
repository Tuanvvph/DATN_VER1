package com.web.entity;

import com.web.enums.LoaiGiamGia;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Table(name = "VoucherDonHang")
@Getter
@Setter
public class VoucherDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String code;

    private Double giaTriGiam;

    private Double donToiThieu;

    private Date ngayBatDau;

    private Date ngayKetThuc;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
