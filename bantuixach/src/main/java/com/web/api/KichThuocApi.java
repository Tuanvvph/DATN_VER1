package com.web.api;

import com.web.entity.KichThuoc;
import com.web.entity.MauSac;
import com.web.service.KichThuocService;
import com.web.service.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kich-thuoc")
public class KichThuocApi {

    @Autowired
    private KichThuocService kichThuocService;

    @GetMapping("/public/all")
    public ResponseEntity<?> findAllCategory() {
        List<KichThuoc> result = kichThuocService.findAllList();
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody KichThuoc kichThuoc){
        KichThuoc result = kichThuocService.save(kichThuoc);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        kichThuocService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        KichThuoc result = kichThuocService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
