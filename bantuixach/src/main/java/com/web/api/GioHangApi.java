package com.web.api;

import com.web.entity.GioHang;
import com.web.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/giohang")
public class GioHangApi {

    @Autowired
    private GioHangService gioHangService;

    @GetMapping("/user/my-cart")
    public ResponseEntity<?> myCart(){
        List<GioHang> result = gioHangService.findByUser();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/user/create")
    public ResponseEntity<?> add(@RequestParam Long spctId, @RequestParam Integer quantity){
        gioHangService.addCart(spctId, quantity);
        return new ResponseEntity<>("Success", HttpStatus.CREATED);
    }

    @DeleteMapping("/user/delete")
    public ResponseEntity<?> deleteById(@RequestParam("id") Long id){
        gioHangService.remove(id);
        return new ResponseEntity<>("Success", HttpStatus.CREATED);
    }

    @GetMapping("/user/up-cart")
    public ResponseEntity<?> upCart(@RequestParam("id") Long id){
        gioHangService.upQuantity(id);
        return new ResponseEntity<>("Success",HttpStatus.OK);
    }

    @GetMapping("/user/down-cart")
    public ResponseEntity<?> downCart(@RequestParam("id") Long id){
        gioHangService.downQuantity(id);
        return new ResponseEntity<>("Success",HttpStatus.OK);
    }

    @GetMapping("/user/count-cart")
    public ResponseEntity<?> countCart(){
        Long count = gioHangService.countCart();
        return new ResponseEntity<>(count,HttpStatus.OK);
    }
}
