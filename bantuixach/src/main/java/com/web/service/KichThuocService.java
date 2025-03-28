package com.web.service;

import com.web.entity.KichThuoc;
import com.web.exception.MessageException;
import com.web.repository.KichThuocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class KichThuocService {

    @Autowired
    private KichThuocRepository kichThuocRepository;

    public KichThuoc save(KichThuoc kichThuoc) {
        KichThuoc result = kichThuocRepository.save(kichThuoc);
        return result;
    }


    public void delete(Long id) {
        try {
            kichThuocRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Đã có sản phẩm trong kích thước này, hãy xóa sản phẩm trước");
        }
    }


    public KichThuoc findById(Long id) {
        return kichThuocRepository.findById(id).get();
    }


    public List<KichThuoc> findAllList() {
        List<KichThuoc> list = kichThuocRepository.findAll();
        return list;
    }
}
