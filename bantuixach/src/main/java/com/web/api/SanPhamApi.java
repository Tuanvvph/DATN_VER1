package com.web.api;

import com.web.entity.MauSac;
import com.web.entity.SanPham;
import com.web.service.MauSacService;
import com.web.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sanpham")
public class SanPhamApi {

    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping("/public/all")
    public ResponseEntity<?> findAllCategory() {
        List<SanPham> result = sanPhamService.findAllList();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody SanPham sanPham){
        SanPham result = sanPhamService.save(sanPham);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        sanPhamService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        SanPham result = sanPhamService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
