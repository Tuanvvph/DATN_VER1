package com.web.service;

import com.web.entity.*;
import com.web.enums.LoaiGiamGia;
import com.web.exception.MessageException;
import com.web.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Component
public class VoucherSanPhamService {

    @Autowired
    private VoucherSanPhamRepository voucherSanPhamRepository;

    @Autowired
    private VoucherSanPhamSPCTRepository voucherSanPhamSPCTRepository;

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public VoucherSanPham save(VoucherSanPham v, List<Long> idProducs) {
        if(v.getNgayKetThuc().before(new Date(System.currentTimeMillis()))){
            throw new MessageException("Ngày kết thúc phải sau ngày hiện tại");
        }
        List<SanPhamChiTiet> sanPhamChiTiets = sanPhamChiTietRepository.findBySanPhamIds(idProducs);
        sanPhamChiTiets.forEach(p->{
            if(p.getGiaCu() != null){
                throw new MessageException("Sản phẩm: "+p.getSanPham().getTenSanPham()+" đang có đợt giảm giá");
            }
        });
        if(v.getLoaiGiamGia().equals(LoaiGiamGia.PHAN_TRAM)){
            if(v.getGiaTriGiam() > 90){
                throw new MessageException("gía trị giảm phải <= 90%");
            }
            else if(v.getGiaTriGiam() < 1){
                throw new MessageException("gía trị giảm phải >= 1%");
            }
        }
        if(v.getLoaiGiamGia().equals(LoaiGiamGia.CO_DINH)){
            sanPhamChiTiets.forEach(p->{
                if(p.getGia() <= v.getGiaTriGiam()){
                    throw new MessageException("Sản phẩm: "+p.getSanPham().getTenSanPham()+", Màu: "+p.getMauSac().getTen()+", Size: "+p.getKichThuoc().getTen()+
                            " có giá "+p.getGia());
                }
            });
        }
        voucherSanPhamRepository.save(v);
        if(v.getLoaiGiamGia().equals(LoaiGiamGia.PHAN_TRAM)){
            sanPhamChiTiets.forEach(p->{
                p.setGiaCu(p.getGia());
                p.setGia(p.getGia() - (p.getGiaCu() * v.getGiaTriGiam() / 100));
                sanPhamChiTietRepository.save(p);

                VoucherSanPhamSPCT voucherSanPhamSPCT = new VoucherSanPhamSPCT();
                voucherSanPhamSPCT.setVoucherSanPham(v);
                voucherSanPhamSPCT.setSanPhamChiTiet(p);
                voucherSanPhamSPCTRepository.save(voucherSanPhamSPCT);
            });
        }
        else{
            sanPhamChiTiets.forEach(p->{
                p.setGiaCu(p.getGia());
                p.setGia(p.getGia() - v.getGiaTriGiam());
                sanPhamChiTietRepository.save(p);

                VoucherSanPhamSPCT voucherSanPhamSPCT = new VoucherSanPhamSPCT();
                voucherSanPhamSPCT.setVoucherSanPham(v);
                voucherSanPhamSPCT.setSanPhamChiTiet(p);
                voucherSanPhamSPCTRepository.save(voucherSanPhamSPCT);
            });
        }
        return v;
    }


    public void delete(Long id) {
        List<VoucherSanPhamSPCT> voucherSanPhamSPCTS = voucherSanPhamSPCTRepository.findByVoucherSp(id);
        voucherSanPhamSPCTS.forEach(p->{
            if(p.getSanPhamChiTiet().getGiaCu() != null){
                p.getSanPhamChiTiet().setGia(p.getSanPhamChiTiet().getGiaCu());
                p.getSanPhamChiTiet().setGiaCu(null);
                sanPhamChiTietRepository.save(p.getSanPhamChiTiet());
            }
        });
        voucherSanPhamSPCTRepository.deleteByVoucherSp(id);
        voucherSanPhamRepository.deleteById(id);
    }


    public void hoanThanh(Long id) {
        VoucherSanPham voucherSanPham = voucherSanPhamRepository.findById(id).get();
        if(voucherSanPham.getDaHoanThanh() == true){
            throw new MessageException("Đã hoàn thành, không thể cập nhật");
        }
        voucherSanPham.setDaHoanThanh(true);
        voucherSanPhamRepository.save(voucherSanPham);
        List<VoucherSanPhamSPCT> voucherSanPhamSPCTS = voucherSanPhamSPCTRepository.findByVoucherSp(id);
        voucherSanPhamSPCTS.forEach(p->{
            if(p.getSanPhamChiTiet().getGiaCu() != null){
                p.getSanPhamChiTiet().setGia(p.getSanPhamChiTiet().getGiaCu());
                p.getSanPhamChiTiet().setGiaCu(null);
                sanPhamChiTietRepository.save(p.getSanPhamChiTiet());
            }
        });
    }


    public VoucherSanPham findById(Long id) {
        return voucherSanPhamRepository.findById(id).get();
    }

    public List<VoucherSanPham> findAllList() {
        List<VoucherSanPham> list = voucherSanPhamRepository.findAll();
        return list;
    }

    public List<SanPham> sanPhamGiamGia(Long id) {
        List<SanPham> list = sanPhamRepository.findSanPhamGiamGia(id);
        return list;
    }

}
