package com.web.api;

import com.web.entity.DiaChi;
import com.web.entity.LoaiSanPham;
import com.web.service.DiaChiService;
import com.web.service.LoaiSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diachi")
public class DiaChiApi {

    @Autowired
    private DiaChiService diaChiService;

    @GetMapping("/user/all")
    public ResponseEntity<?> findAllCategory() {
        List<DiaChi> result = diaChiService.findByUser();
        return new ResponseEntity(result, HttpStatus.CREATED);
    }

    @PostMapping("/user/create-update")
    public ResponseEntity<?> save(@RequestBody DiaChi diaChi){
        DiaChi result = diaChiService.save(diaChi);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/user/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        diaChiService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        DiaChi result = diaChiService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
