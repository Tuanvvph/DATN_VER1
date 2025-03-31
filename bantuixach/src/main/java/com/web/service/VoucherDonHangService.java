package com.web.service;

import com.web.entity.VoucherDonHang;
import com.web.exception.MessageException;
import com.web.repository.VoucherDonHangRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class VoucherDonHangService {

    @Autowired
    private VoucherDonHangRepository voucherRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private GioHangService gioHangService;

    public VoucherDonHang save(VoucherDonHang v) {
        if(v.getId() == null){
            if(voucherRepository.findByCode(v.getCode()).isPresent()){
                throw new MessageException("Mã giảm giá đã tồn tại");
            }
            v.setCreatedAt(LocalDateTime.now());
        }
        else{
            if(voucherRepository.findByCode(v.getCode(), v.getId()).isPresent()){
                throw new MessageException("Mã giảm giá đã tồn tại");
            }
            VoucherDonHang ex = voucherRepository.findById(v.getId()).get();
            v.setCreatedAt(ex.getCreatedAt());
            v.setUpdatedAt(LocalDateTime.now());
        }
        if(v.getGiaTriGiam() >= v.getDonToiThieu()){
            throw new MessageException("giá trị giảm phải nhỏ hơn đơn tối thiểu");
        }
        if(v.getNgayBatDau().after(v.getNgayKetThuc())){
            throw new MessageException("Ngày bắt đầu phải trước ngày kết thúc");
        }
        voucherRepository.save(v);
        return v;
    }


    public void delete(Long id) {
        try {
            voucherRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Voucher đã được sử dụng, không thể xóa");
        }
    }


    public VoucherDonHang findById(Long id) {
        return voucherRepository.findById(id).get();
    }


    public List<VoucherDonHang> findAllList() {
        List<VoucherDonHang> list = voucherRepository.findAll();
        return list;
    }


    public List<VoucherDonHang> voucherKhaDung() {
        Double tongCart = gioHangService.totalAmountCart();
        List<VoucherDonHang> list = voucherRepository.voucherKhaDung(tongCart, new Date(System.currentTimeMillis()));
        return list;
    }

    public VoucherDonHang findByCodeAndDh(String code, Double donHang) {
        Optional<VoucherDonHang> v = voucherRepository.findByCode(code);
        if(v.isEmpty()){
            throw new MessageException("Voucher không khả dụng");
        }
        else{
            if(v.get().getNgayKetThuc().before(new Date(System.currentTimeMillis()))){
                throw new MessageException("Voucher này đã kết thúc");
            }
            if(v.get().getNgayBatDau().after(new Date(System.currentTimeMillis()))){
                throw new MessageException("Voucher này chưa thể sử dụng");
            }
            if(v.get().getDonToiThieu() > donHang){
                throw new MessageException("Hãy mua thêm "+(v.get().getDonToiThieu() - donHang) +" để có thể sử dụng voucher này");
            }
        }
        return v.get();
    }
}
