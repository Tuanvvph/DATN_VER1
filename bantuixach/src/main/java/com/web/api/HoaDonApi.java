package com.web.api;

import com.web.dto.BanTaiQuay;
import com.web.dto.InvoiceRequest;
import com.web.entity.GioHang;
import com.web.entity.HoaDon;
import com.web.entity.HoaDonChiTiet;
import com.web.entity.LoaiSanPham;
import com.web.enums.LoaiThanhToan;
import com.web.enums.TrangThai;
import com.web.service.GioHangService;
import com.web.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
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

    @PostMapping("/admin/create")
    public ResponseEntity<?> create(@RequestBody BanTaiQuay banTaiQuay){
        HoaDon result = hoaDonService.banTaiQuay(banTaiQuay);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/user/my-hoadon")
    public ResponseEntity<?> myHd() {
        List<HoaDon> result = hoaDonService.findByUser();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/user/find-by-id")
    public ResponseEntity<?> myHd(@RequestParam Long id) {
        HoaDon result = hoaDonService.findById(id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/admin/find-by-id")
    public ResponseEntity<?> findById(@RequestParam Long id) {
        HoaDon result = hoaDonService.findById(id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/user/hdct-by-hoadon")
    public ResponseEntity<?> hoaDonChiTiet(@RequestParam Long id) {
        List<HoaDonChiTiet> result = hoaDonService.findByHoaDon(id);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/admin/find-all")
    public ResponseEntity<?> findAll(@RequestParam(required = false) Date from,
                                     @RequestParam(required = false) Date to,
                                     @RequestParam(required = false) LoaiThanhToan loaiThanhToan,
                                     @RequestParam(required = false) TrangThai trangThai, Pageable pageable){
        List<HoaDon> result = hoaDonService.findAllFull(from, to,loaiThanhToan, trangThai,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/hdct-by-hoadon")
    public ResponseEntity<?> hoaDonChiTietAndAd(@RequestParam Long id) {
        List<HoaDonChiTiet> result = hoaDonService.findByHoaDon(id);
        return new ResponseEntity(result, HttpStatus.OK);
    }


    @PostMapping("/admin/update-trangthai")
    public ResponseEntity<?> updateTrangThai(@RequestParam TrangThai trangThai, @RequestParam Long id) {
        HoaDon result = hoaDonService.updateTrangThai(trangThai, id);
        return new ResponseEntity(result, HttpStatus.OK);
    }


}
