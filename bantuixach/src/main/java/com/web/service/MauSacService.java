package com.web.service;

import com.web.entity.LoaiSanPham;
import com.web.entity.MauSac;
import com.web.exception.MessageException;
import com.web.repository.LoaiSanPhamRepository;
import com.web.repository.MauSacRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;

@Component
public class MauSacService {

    @Autowired
    private MauSacRepository mauSacRepository;

    public MauSac save(MauSac mauSac) {
        MauSac result = mauSacRepository.save(mauSac);
        return result;
    }


    public void delete(Long id) {
        try {
            mauSacRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Đã có sản phẩm trong màu sắc này, hãy xóa sản phẩm trước");
        }
    }


    public MauSac findById(Long id) {
        return mauSacRepository.findById(id).get();
    }


    public List<MauSac> findAllList() {
        List<MauSac> list = mauSacRepository.findAll();
        return list;
    }
}
