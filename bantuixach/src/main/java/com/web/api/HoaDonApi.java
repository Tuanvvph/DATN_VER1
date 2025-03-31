package com.web.api;

import com.web.dto.InvoiceRequest;
import com.web.entity.GioHang;
import com.web.entity.HoaDon;
import com.web.service.GioHangService;
import com.web.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hoadon")
public class HoaDonApi {

    @Autowired
    private HoaDonService hoaDonService;

    @PostMapping("/user/create")
    public ResponseEntity<?> add(@RequestBody InvoiceRequest invoiceRequest){
        HoaDon result = hoaDonService.create(invoiceRequest);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

}
