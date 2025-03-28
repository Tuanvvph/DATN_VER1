package com.web.service;

import com.web.entity.SanPham;
import com.web.entity.SanPhamChiTiet;
import com.web.exception.MessageException;
import com.web.repository.SanPhamChiTietRepository;
import com.web.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Component
public class SanPhamChiTietService {

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    public SanPhamChiTiet save(SanPhamChiTiet ct) {
        if(ct.getId() == null){
            Optional<SanPhamChiTiet> sp = sanPhamChiTietRepository.findByKichThuocMauSacAndSp(ct.getMauSac().getId(), ct.getKichThuoc().getId(), ct.getSanPham().getId());
            if(sp.isPresent()){
                throw new MessageException("Đã có sản phẩm chi tiết này, không thể thêm lại");
            }
        }
        else{
            Optional<SanPhamChiTiet> sp = sanPhamChiTietRepository.findByKichThuocMauSacAndSpNot(ct.getMauSac().getId(), ct.getKichThuoc().getId(), ct.getSanPham().getId(), ct.getId());
            if(sp.isPresent()){
                throw new MessageException("Đã có sản phẩm chi tiết này, không thể thêm lại");
            }
        }
        SanPhamChiTiet result = sanPhamChiTietRepository.save(ct);
        return result;
    }


    public void delete(Long id) {
        try {
            sanPhamChiTietRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Đã có đơn hàng cho sản phẩm chi tiết này, hãy xóa đơn hàng trước");
        }
    }


    public SanPhamChiTiet findById(Long id) {
        return sanPhamChiTietRepository.findById(id).get();
    }


    public List<SanPhamChiTiet> findAllBySanPham(Long idSp) {
        List<SanPhamChiTiet> list = sanPhamChiTietRepository.findBySanPham(idSp);
        return list;
    }
}
