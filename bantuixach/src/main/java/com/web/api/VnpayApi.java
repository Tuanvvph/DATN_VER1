package com.web.api;

import com.nimbusds.openid.connect.sdk.assurance.evidences.Voucher;
import com.web.dto.PaymentDto;
import com.web.dto.ResponsePayment;
import com.web.exception.MessageException;
import com.web.repository.SanPhamChiTietRepository;
import com.web.service.VoucherDonHangService;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin
public class VnpayApi {

    @Autowired
    private SanPhamChiTietRepository sanPhamChiTietRepository;

    @Autowired
    private VoucherDonHangService voucherDonHangService;

    @Autowired
    private VNPayService vnPayService;

    @PostMapping("/user/urlpayment")
    public ResponsePayment getUrlPayment(@RequestBody PaymentDto paymentDto){
        String orderId = String.valueOf(System.currentTimeMillis());
        String vnpayUrl = vnPayService.createOrder(paymentDto.getTongTien(), orderId, paymentDto.getReturnUrl());
        ResponsePayment responsePayment = new ResponsePayment(vnpayUrl);
        return responsePayment;
    }

}
