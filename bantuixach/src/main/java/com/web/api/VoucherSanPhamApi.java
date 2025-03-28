package com.web.api;

import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.VoucherSanPhamDto;
import com.web.entity.SanPham;
import com.web.entity.VoucherDonHang;
import com.web.entity.VoucherSanPham;
import com.web.service.VoucherDonHangService;
import com.web.service.VoucherSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voucher-sanpham")
public class VoucherSanPhamApi {

    @Autowired
    private VoucherSanPhamService voucherSanPhamService;

    @GetMapping("/admin/all")
    public ResponseEntity<?> findAll() {
        List<VoucherSanPham> result = voucherSanPhamService.findAllList();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/admin/sanpham-giamgia")
    public ResponseEntity<?> findAll(@RequestParam Long id) {
        List<SanPham> result = voucherSanPhamService.sanPhamGiamGia(id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody VoucherSanPhamDto dto){
        VoucherSanPham result = voucherSanPhamService.save(dto.getVoucherSanPham(), dto.getIdProducts());
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        voucherSanPhamService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/admin/hoanthanh")
    public ResponseEntity<?> hoanThanh(@RequestParam("id") Long id){
        voucherSanPhamService.hoanThanh(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        VoucherSanPham result = voucherSanPhamService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
