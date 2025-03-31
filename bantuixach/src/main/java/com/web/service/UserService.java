package com.web.service;


import com.web.dto.CustomUserDetails;
import com.web.dto.TokenDto;
import com.web.dto.UserRequest;
import com.web.dto.UserUpdate;
import com.web.entity.TaiKhoan;
import com.web.exception.MessageException;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.AuthorityRepository;
import com.web.repository.UserRepository;
import com.web.utils.Contains;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.*;

@Component
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public TokenDto login(String email, String password) throws Exception {
        Optional<TaiKhoan> users = userRepository.findByEmail(email);
        // check infor user
        checkUser(users);
        if(passwordEncoder.matches(password, users.get().getPassword())){
            CustomUserDetails customUserDetails = new CustomUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(users.get());
            return tokenDto;
        }
        else{
            throw new MessageException("Mật khẩu không chính xác", 400);
        }
    }


    public Boolean checkUser(Optional<TaiKhoan> users){
        if(users.isPresent() == false){
            throw new MessageException("Không tìm thấy tài khoản", 404);
        }
        else if(users.get().getTrangThai() == false){
            throw new MessageException("Tài khoản đã bị khóa", 500);
        }
        return true;
    }

    public TaiKhoan regisUser(UserRequest userRequest) {
        userRepository.findByEmail(userRequest.getEmail())
                .ifPresent(exist->{
                    throw new MessageException("Email đã được sử dụng", 400);
                });
        TaiKhoan user = new TaiKhoan();
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setQuyen(authorityRepository.findByName(Contains.ROLE_USER));
        user.setTrangThai(true);
        user.setEmail(userRequest.getEmail());
        user.setHoTen(userRequest.getFullName());
        user.setSoDienThoai(userRequest.getPhone());
        user.setCreatedAt(new Date(System.currentTimeMillis()));
        TaiKhoan result = userRepository.save(user);
//        mailService.sendEmail(user.getEmail(), "Xác nhận tài khoản của bạn","Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
//                "Để kích hoạt tài khoản của bạn, hãy nhập mã xác nhận bên dưới để xác thực tài khoản của bạn<br><br>" +
//                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">"+user.getActivation_key()+"</a>",false, true);
        return result;
    }



    public void guiYeuCauQuenMatKhau(String email) {
        Optional<TaiKhoan> user = userRepository.findByEmail(email);
        checkUser(user);
        String randomPass = userUtils.randomPass();
        user.get().setPassword(passwordEncoder.encode(randomPass));
        userRepository.save(user.get());
        mailService.sendEmail(email, "Quên mật khẩu","Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
                "Chúng tôi đã tạo một mật khẩu mới từ yêu cầu của bạn<br>" +
                "Tuyệt đối không được chia sẻ mật khẩu này với bất kỳ ai. Bạn hãy thay đổi mật khẩu ngay sau khi đăng nhập<br><br>" +
                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">"+randomPass+"</a>",false, true);

    }

    public void updateInfor(UserUpdate userUpdate){
        TaiKhoan user = userUtils.getUserWithAuthority();
        user.setHoTen(userUpdate.getFullName());
        user.setSoDienThoai(userUpdate.getPhone());
//        user.setAnh(userUpdate.getAvatar());
        userRepository.save(user);
    }

    public void changePass(String oldPass, String newPass) {
        TaiKhoan user = userUtils.getUserWithAuthority();
        if(passwordEncoder.matches(oldPass, user.getPassword())){
            user.setPassword(passwordEncoder.encode(newPass));
            userRepository.save(user);
        }
        else{
            throw new MessageException("Mật khẩu cũ không chính xác", 500);
        }
    }

    public List<TaiKhoan> getUserByRole(String role) {
        if(role == null){
            return userRepository.findAll();
        }
        return userRepository.getUserByRole(role);
    }
}
