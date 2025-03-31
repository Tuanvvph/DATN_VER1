package com.web.service;

import com.web.entity.*;
import com.web.exception.MessageException;
import com.web.repository.DiaChiRepository;
import com.web.repository.GioHangRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private UserUtils userUtils;


    public DiaChi save(DiaChi diaChi) {
        if(diaChi.getId() == null){
            diaChi.setCreatedAt(LocalDateTime.now());
        }
        else{
            DiaChi d = diaChiRepository.findById(diaChi.getId()).get();
            diaChi.setCreatedAt(d.getCreatedAt());
            diaChi.setUpdatedAt(LocalDateTime.now());
        }
        diaChi.setTaiKhoan(userUtils.getUserWithAuthority());
        diaChiRepository.save(diaChi);
        return diaChi;
    }

    public List<DiaChi> findByUser() {
        List<DiaChi> list = diaChiRepository.findByUser(userUtils.getUserWithAuthority().getId());
        return list;
    }

    public DiaChi findById(Long id) {
        return diaChiRepository.findById(id).get();
    }

    public void delete(Long id) {
        diaChiRepository.deleteById(id);
    }
}
