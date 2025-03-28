package com.web.service;

import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.BanTaiQuay;
import com.web.dto.InvoiceRequest;
import com.web.dto.SanPhamChiTietDto;
import com.web.entity.*;
import com.web.enums.LoaiHoaDon;
import com.web.enums.LoaiThanhToan;
import com.web.enums.TrangThai;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class HoaDonService {

    @Autowired
    private GioHangRepository gioHangRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private LichSuThanhToanRepository lichSuThanhToanRepository;

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private GioHangService gioHangService;

    @Autowired
    private VoucherDonHangService voucherDonHangService;

    @Autowired
    private DiaChiRepository diaChiRepository;

    public HoaDon create(InvoiceRequest invoiceRequest) {
        List<GioHang> list = gioHangService.findByUser();
        list.forEach(p->{
            if(p.getSoLuong() > p.getSanPhamChiTiet().getSoLuong() || p.getSanPhamChiTiet().getSoLuong() == 0){
                throw new MessageException(p.getSanPhamChiTiet().getSanPham().getTenSanPham()+", màu "+p.getSanPhamChiTiet().getMauSac().getTen()+"," +
                        " kích thước "+p.getSanPhamChiTiet().getKichThuoc().getTen()+" chỉ còn "+p.getSanPhamChiTiet().getSoLuong());
            }
        });

        if(invoiceRequest.getPayType().equals(LoaiThanhToan.VNPAY)){
            if(invoiceRequest.getVnpOrderInfo() == null){
                throw new MessageException("vnpay order infor require");
            }
            if(lichSuThanhToanRepository.findByRequestId(invoiceRequest.getVnpOrderInfo()).isPresent()){
                throw new MessageException("Đơn hàng đã được thanh toán");
            }
            int paymentStatus = vnPayService.orderReturnByUrl(invoiceRequest.getUrlVnpay());
            if(paymentStatus != 1){
                throw new MessageException("Thanh toán thất bại");
            }
        }
        Double totalAmount = gioHangService.totalAmountCart();
        DiaChi diaChi = diaChiRepository.findById(invoiceRequest.getIdDiaChi()).get();
        HoaDon invoice = new HoaDon();
        invoice.setPhiShip(invoiceRequest.getShipCost());
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setLoaiHoaDon(LoaiHoaDon.ONLINE);
        invoice.setTaiKhoan(userUtils.getUserWithAuthority());
        invoice.setHoTen(diaChi.getHoTen());
        invoice.setLoaiThanhToan(invoiceRequest.getPayType());
        invoice.setTrangThai(TrangThai.DANG_CHO_XAC_NHAN);
        invoice.setDiaChi(diaChi.getDiaChi());
        invoice.setSoDienThoai(diaChi.getSoDienThoai());
        invoice.setGhiChu(invoiceRequest.getNote());

        if(invoiceRequest.getMaVoucher() != null){
            if(!invoiceRequest.getMaVoucher().equals("null") && !invoiceRequest.getMaVoucher().equals("")){
                System.out.println("voucher use === "+invoiceRequest.getMaVoucher());
                VoucherDonHang voucher = voucherDonHangService.findByCodeAndDh(invoiceRequest.getMaVoucher(), totalAmount);
                if(voucher != null){
                    totalAmount = totalAmount - voucher.getGiaTriGiam();
                    invoice.setVoucherDonHang(voucher);
                }
            }
        }
        invoice.setTongGia(totalAmount);
        HoaDon result = hoaDonRepository.save(invoice);
        for(GioHang c : list){
            HoaDonChiTiet invoiceDetail = new HoaDonChiTiet();
            invoiceDetail.setHoaDon(result);
            invoiceDetail.setGia(c.getSanPhamChiTiet().getGia());
            invoiceDetail.setSoLuong(c.getSoLuong());
            invoiceDetail.setSanPhamChiTiet(c.getSanPhamChiTiet());
            hoaDonChiTietRepository.save(invoiceDetail);
            c.getSanPhamChiTiet().setSoLuong(c.getSanPhamChiTiet().getSoLuong() - c.getSoLuong());
            sanPhamChiTietRepository.save(c.getSanPhamChiTiet());
        }

        if(invoiceRequest.getPayType().equals(LoaiThanhToan.VNPAY)){
            LichSuThanhToan historyPay = new LichSuThanhToan();
            historyPay.setRequestId(invoiceRequest.getVnpOrderInfo());
            lichSuThanhToanRepository.save(historyPay);
        }
        gioHangService.removeAll();
        return null;
    }

    public List<HoaDon> findByUser() {
        List<HoaDon> list = hoaDonRepository.findByUser(userUtils.getUserWithAuthority().getId());
        return list;
    }

    public HoaDon findById(Long id) {
        HoaDon list = hoaDonRepository.findById(id).get();
        return list;
    }

    public List<HoaDonChiTiet> findByHoaDon(Long id) {
        List<HoaDonChiTiet> list = hoaDonChiTietRepository.findByHoaDon(id);
        return list;
    }

    public List<HoaDon> findAllFull(Date from, Date to, LoaiThanhToan loaiThanhToan, TrangThai trangThai, Pageable pageable) {
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        List<HoaDon> page = null;
        if(loaiThanhToan == null && trangThai == null){
            page = hoaDonRepository.findByDate(from, to);
        }
        else if(loaiThanhToan == null && trangThai != null){
            page = hoaDonRepository.findByDateAndStatus(from, to, trangThai.name());
        }
        else if(loaiThanhToan != null && trangThai == null){
            page = hoaDonRepository.findByDateAndPaytype(from, to,loaiThanhToan.name());
        }
        else if(loaiThanhToan != null && trangThai != null){
            page = hoaDonRepository.findByDateAndPaytypeAndStatus(from, to,loaiThanhToan.name(),trangThai.name());
        }

        return page;
    }

    public HoaDon updateTrangThai(TrangThai trangThai, Long id) {
        HoaDon hoaDon = hoaDonRepository.findById(id).get();
        if(hoaDon.getTrangThai().equals(TrangThai.DA_NHAN) || hoaDon.getTrangThai().equals(TrangThai.DA_HUY) || hoaDon.getTrangThai().equals(TrangThai.KHONG_NHAN_HANG)){
            throw new MessageException("Không thể cập nhật trạng thái");
        }
        hoaDon.setTrangThai(trangThai);
        hoaDon.setUpdatedAt(LocalDateTime.now());
        hoaDonRepository.save(hoaDon);
        if(trangThai.equals(TrangThai.DA_HUY) || trangThai.equals(TrangThai.KHONG_NHAN_HANG)){
            List<HoaDonChiTiet> hoaDonChiTiets = hoaDonChiTietRepository.findByHoaDon(id);
            hoaDonChiTiets.forEach(p->{
                p.getSanPhamChiTiet().setSoLuong(p.getSanPhamChiTiet().getSoLuong() + p.getSoLuong());
                sanPhamChiTietRepository.save(p.getSanPhamChiTiet());
            });
        }
        return hoaDon;
    }

    public HoaDon banTaiQuay(BanTaiQuay b) {
        if(b.getListSp().size() == 0){
            throw new MessageException("Hãy chọn ít nhất 1 sản phẩm");
        }
        Double tong = 0D;
        for(SanPhamChiTietDto s : b.getListSp()){
            SanPhamChiTiet spct = sanPhamChiTietRepository.findById(s.getChiTietSp().getId()).get();
            tong += spct.getGia() * s.getSoLuong();
            if(spct.getSoLuong() < s.getSoLuong()){
                throw new MessageException(spct.getSanPham().getTenSanPham()+", màu "+spct.getMauSac().getTen()+"," +
                        " kích thước "+spct.getKichThuoc().getTen()+" chỉ còn "+spct.getSoLuong());

            }
        }
        VoucherDonHang v = null;
        if(b.getIdVoucher() != null){
            v = voucherDonHangService.findById(b.getIdVoucher());
            if(v.getDonToiThieu() > tong){
                throw new MessageException("Mua thêm "+(v.getDonToiThieu() - tong)+" để sử dụng voucher này");
            }
            else{
                tong = tong - v.getGiaTriGiam();
            }
        }
        HoaDon hoaDon = new HoaDon();
        hoaDon.setLoaiHoaDon(LoaiHoaDon.TAI_QUAY);
        hoaDon.setLoaiThanhToan(LoaiThanhToan.COD);
        hoaDon.setHoTen(b.getHoTen());
        hoaDon.setSoDienThoai(b.getSoDienThoai());
        hoaDon.setVoucherDonHang(v);
        hoaDon.setTaiKhoan(userUtils.getUserWithAuthority());
        hoaDon.setTrangThai(TrangThai.DA_NHAN);
        hoaDon.setCreatedAt(LocalDateTime.now());
        hoaDon.setTongGia(tong);
        hoaDon.setPhiShip(0D);
        hoaDonRepository.save(hoaDon);
        for(SanPhamChiTietDto s : b.getListSp()){
            SanPhamChiTiet spct = sanPhamChiTietRepository.findById(s.getChiTietSp().getId()).get();
            HoaDonChiTiet hoaDonChiTiet = new HoaDonChiTiet();
            hoaDonChiTiet.setHoaDon(hoaDon);
            hoaDonChiTiet.setSanPhamChiTiet(spct);
            hoaDonChiTiet.setSoLuong(s.getSoLuong());
            hoaDonChiTiet.setGia(spct.getGia());
            hoaDonChiTietRepository.save(hoaDonChiTiet);
            spct.setSoLuong(spct.getSoLuong() - s.getSoLuong());
            sanPhamChiTietRepository.save(spct);
        }
        return null;
    }
}
