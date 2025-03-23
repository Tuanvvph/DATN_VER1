package com.web.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "Quyen")
@Getter
@Setter
@ToString
public class Quyen {

    @Id
    private String tenQuyen;

}
