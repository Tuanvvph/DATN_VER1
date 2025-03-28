package com.web.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class BanTaiQuay {

    private String hoTen;

    private String soDienThoai;

    private List<SanPhamChiTietDto> listSp = new ArrayList<>();

    private Long idVoucher;
}
