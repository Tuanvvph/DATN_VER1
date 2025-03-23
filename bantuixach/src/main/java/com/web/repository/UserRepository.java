package com.web.repository;

import com.web.entity.TaiKhoan;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<TaiKhoan,Long> {

    @Query(value = "select u from TaiKhoan u where u.email = ?1")
    Optional<TaiKhoan> findByUsername(String username);

    @Query(value = "select u from TaiKhoan u where u.email = ?1")
    Optional<TaiKhoan> findByEmail(String email);

    @Query("select u from TaiKhoan u where u.quyen.tenQuyen = ?1")
    List<TaiKhoan> getUserByRole(String role);

    @Query("select count(u.id) from TaiKhoan u where u.quyen.tenQuyen = ?1")
    Long tongUserByRole(String role);

    @Query("select count(u.id) from TaiKhoan u where u.quyen.tenQuyen = ?1")
    public Double countAdmin(String role);
}
