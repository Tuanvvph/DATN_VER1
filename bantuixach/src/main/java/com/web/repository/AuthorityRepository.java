package com.web.repository;

import com.web.entity.Quyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AuthorityRepository extends JpaRepository<Quyen,String> {

    @Query("select a from Quyen a where a.tenQuyen = ?1")
    public Quyen findByName(String name);
}
