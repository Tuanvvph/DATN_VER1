package com.web.service;

import com.web.entity.MauSac;
import com.web.entity.SanPham;
import com.web.exception.MessageException;
import com.web.repository.MauSacRepository;
import com.web.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;

@Component
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public SanPham save(SanPham sanPham) {
        if(sanPham.getId() == null){
            sanPham.setCreatedAt(new Date(System.currentTimeMillis()));
        }
        else{
            SanPham ex = sanPhamRepository.findById(sanPham.getId()).get();
            sanPham.setCreatedAt(ex.getCreatedAt());
            sanPham.setUpdatedAt(new Date(System.currentTimeMillis()));
        }
        SanPham result = sanPhamRepository.save(sanPham);
        return result;
    }


    public void delete(Long id) {
        try {
            sanPhamRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Đã có đơn hàng cho sản phẩm này, hãy xóa đơn hàng trước");
        }
    }


    public SanPham findById(Long id) {
        return sanPhamRepository.findById(id).get();
    }


    public List<SanPham> findAllList() {
        List<SanPham> list = sanPhamRepository.findAll();
        return list;
    }
}
