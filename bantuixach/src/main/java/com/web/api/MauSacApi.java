package com.web.api;

import com.web.entity.LoaiSanPham;
import com.web.entity.MauSac;
import com.web.service.LoaiSanPhamService;
import com.web.service.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mau-sac")
public class MauSacApi {

    @Autowired
    private MauSacService mauSacService;

    @GetMapping("/public/all")
    public ResponseEntity<?> findAllCategory() {
        List<MauSac> result = mauSacService.findAllList();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody MauSac mauSac){
        MauSac result = mauSacService.save(mauSac);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        mauSacService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        MauSac result = mauSacService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
