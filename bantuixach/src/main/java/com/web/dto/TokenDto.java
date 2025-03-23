package com.web.dto;

import com.web.entity.TaiKhoan;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDto {

    private String token;

    private TaiKhoan user;
}
