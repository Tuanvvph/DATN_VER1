package com.web.api;

import com.web.dto.LoaiSanPhamDto;
import com.web.repository.HoaDonRepository;
import com.web.repository.LoaiSanPhamRepository;
import com.web.repository.SanPhamRepository;
import com.web.repository.UserRepository;
import com.web.utils.Contains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/thongke")
public class ThongKeApi {

    @Autowired
    private HoaDonRepository invoiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SanPhamRepository productRepository;

    @Autowired
    private LoaiSanPhamRepository loaiSanPhamRepository;

    @GetMapping("/admin/revenue-this-month")
    public Double doanhThuThangNay(){
        Date date = new Date(System.currentTimeMillis());
        String[] str = date.toString().split("-");
        Integer year = Integer.valueOf(str[0]);
        Integer month = Integer.valueOf(str[1]);
        return invoiceRepository.calDt(month, year);
    }

    @GetMapping("/admin/number-invoice-today")
    public Long numInvoiceToDay(){
        Date date = new Date(System.currentTimeMillis());
        return invoiceRepository.soDonHomNay(date);
    }

    @GetMapping("/admin/number-user")
    public Long numberAdmin(){
        return userRepository.countAdmin(Contains.ROLE_USER);
    }

    @GetMapping("/admin/number-product")
    public Long numberProduct(){
        return productRepository.count();
    }

    @GetMapping("/admin/revenue-year")
    public List<Double> doanhThu(@RequestParam("year") Integer year){
        List<Double> list = new ArrayList<>();
        for(int i=1; i< 13; i++){
            Double sum = invoiceRepository.calDt(i, year);
            if(sum == null){
                sum = 0D;
            }
            list.add(sum);
        }
        return list;
    }

    @GetMapping("/admin/soluongbandanhmuc")
    public List<LoaiSanPhamDto> slban(){
        List<LoaiSanPhamDto> list = loaiSanPhamRepository.findSoLuongBan();
        return list;
    }
}
