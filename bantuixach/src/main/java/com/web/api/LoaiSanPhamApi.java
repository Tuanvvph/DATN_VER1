package com.web.api;
import com.web.entity.LoaiSanPham;
import com.web.service.LoaiSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/loai-san-pham")
public class LoaiSanPhamApi {

    @Autowired
    private LoaiSanPhamService loaiSanPhamService;

    @GetMapping("/public/all")
    public ResponseEntity<?> findAllCategory() {
        List<LoaiSanPham> result = loaiSanPhamService.findAllList();
        return new ResponseEntity(result, HttpStatus.CREATED);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody LoaiSanPham loaiSanPham){
        LoaiSanPham result = loaiSanPhamService.save(loaiSanPham);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        loaiSanPhamService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        LoaiSanPham result = loaiSanPhamService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
