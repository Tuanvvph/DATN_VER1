package com.web.dto;

import com.web.entity.VoucherSanPham;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VoucherSanPhamDto {

    private VoucherSanPham voucherSanPham;

    private List<Long> idProducts;
}
