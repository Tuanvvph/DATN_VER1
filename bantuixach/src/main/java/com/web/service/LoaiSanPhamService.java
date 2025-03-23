package com.web.service;
import com.web.entity.LoaiSanPham;
import com.web.exception.MessageException;
import com.web.repository.LoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;

@Component
public class LoaiSanPhamService {

    @Autowired
    private LoaiSanPhamRepository loaiSanPhamRepository;

    public LoaiSanPham save(LoaiSanPham category) {
        if(category.getId() == null){
            category.setCreatedAt(new Date(System.currentTimeMillis()));
        }
        else{
            LoaiSanPham loaiSanPham = loaiSanPhamRepository.findById(category.getId()).get();
            category.setCreatedAt(loaiSanPham.getCreatedAt());
            category.setUpdatedAt(new Date(System.currentTimeMillis()));
        }
        LoaiSanPham result = loaiSanPhamRepository.save(category);
        return result;
    }


    public void delete(Long categoryId) {
        try {
            loaiSanPhamRepository.deleteById(categoryId);
        }
        catch (Exception e){
            throw new MessageException("Đã có sản phẩm trong danh mục này, hãy xóa sản phẩm trước");
        }
    }


    public LoaiSanPham findById(Long id) {
        return loaiSanPhamRepository.findById(id).get();
    }


    public Page<LoaiSanPham> findAll(Pageable pageable) {
        Page<LoaiSanPham> categories = loaiSanPhamRepository.findAll(pageable);
        return categories;
    }


    public List<LoaiSanPham> findAllList() {
        List<LoaiSanPham> list = loaiSanPhamRepository.findAll();
        return list;
    }
}
