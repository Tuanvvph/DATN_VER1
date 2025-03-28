package com.web.api;

import com.web.entity.MauSac;
import com.web.entity.VoucherDonHang;
import com.web.service.MauSacService;
import com.web.service.VoucherDonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voucher-donhang")
public class VoucherDonHangApi {

    @Autowired
    private VoucherDonHangService voucherDonHangService;

    @GetMapping("/admin/all")
    public ResponseEntity<?> findAll() {
        List<VoucherDonHang> result = voucherDonHangService.findAllList();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody VoucherDonHang voucherDonHang){
        VoucherDonHang result = voucherDonHangService.save(voucherDonHang);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        voucherDonHangService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        VoucherDonHang result = voucherDonHangService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

//    @GetMapping("/public/findByCode")
//    public ResponseEntity<?> findByCode(@RequestParam String code, ){
//        VoucherDonHang result = voucherDonHangService.findByCodeAndDh(code);
//        return new ResponseEntity<>(result,HttpStatus.OK);
//    }
}
