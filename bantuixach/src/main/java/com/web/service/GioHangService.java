package com.web.service;

import com.web.entity.GioHang;
import com.web.entity.SanPhamChiTiet;
import com.web.entity.TaiKhoan;
import com.web.exception.MessageException;
import com.web.repository.GioHangRepository;
import com.web.repository.SanPhamChiTietRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Component
public class GioHangService {

    @Autowired
    private GioHangRepository gioHangRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    public void addCart(Long spctId, Integer quantity) {
        SanPhamChiTiet spct = sanPhamChiTietRepository.findById(spctId).get();
        if(spct.getSoLuong() < quantity){
            throw new MessageException("Số lượng chỉ còn "+spct.getSoLuong());
        }
        TaiKhoan tk = userUtils.getUserWithAuthority();
        Optional<GioHang> ex = gioHangRepository.findByUserAndCtsp(tk.getId(), spctId);
        if(ex.isPresent()){
            ex.get().setSoLuong(quantity + ex.get().getSoLuong());
            gioHangRepository.save(ex.get());
            return;
        }
        GioHang cart = new GioHang();
        cart.setCreatedAt(new Date(System.currentTimeMillis()));
        cart.setSoLuong(quantity);
        cart.setSanPhamChiTiet(spct);
        cart.setTaiKhoan(tk);
        gioHangRepository.save(cart);
    }

    public void remove(Long id) {
        gioHangRepository.deleteById(id);
    }

    public List<GioHang> findByUser() {
        List<GioHang> list = gioHangRepository.findByUser(userUtils.getUserWithAuthority().getId());
        return list;
    }

    public void upQuantity(Long id) {
        GioHang cart = gioHangRepository.findById(id).get();
        cart.setSoLuong(cart.getSoLuong() + 1);
        gioHangRepository.save(cart);
    }

    public void downQuantity(Long id) {
        GioHang cart = gioHangRepository.findById(id).get();
        cart.setSoLuong(cart.getSoLuong() - 1);
        if(cart.getSoLuong() == 0){
            gioHangRepository.deleteById(id);
            return;
        }
        gioHangRepository.save(cart);
    }

    public Long countCart() {
        return gioHangRepository.countByUser(userUtils.getUserWithAuthority().getId());
    }

    public Double totalAmountCart() {
        List<GioHang> list = gioHangRepository.findByUser(userUtils.getUserWithAuthority().getId());
        Double total = 0D;
        for(GioHang c : list){
            total += c.getSoLuong() * c.getSanPhamChiTiet().getGia();
        }
        return total;
    }
}
