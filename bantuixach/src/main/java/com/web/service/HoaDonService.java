package com.web.service;

import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.InvoiceRequest;
import com.web.entity.*;
import com.web.enums.LoaiHoaDon;
import com.web.enums.LoaiThanhToan;
import com.web.enums.TrangThai;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
}
