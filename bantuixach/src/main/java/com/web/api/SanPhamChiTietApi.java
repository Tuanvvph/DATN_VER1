package com.web.api;

import com.web.entity.SanPham;
import com.web.entity.SanPhamChiTiet;
import com.web.service.SanPhamChiTietService;
import com.web.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sanpham-chitiet")
public class SanPhamChiTietApi {

    @Autowired
    private SanPhamChiTietService sanPhamChiTietService;

    @GetMapping("/public/all")
    public ResponseEntity<?> findAll(@RequestParam Long idSp) {
        List<SanPhamChiTiet> result = sanPhamChiTietService.findAllBySanPham(idSp);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody SanPhamChiTiet sanPham){
        SanPhamChiTiet result = sanPhamChiTietService.save(sanPham);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        sanPhamChiTietService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        SanPhamChiTiet result = sanPhamChiTietService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
