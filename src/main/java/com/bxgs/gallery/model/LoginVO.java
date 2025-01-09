package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginVO {
    private String id;
    private String pw;
    private String name;
    private String email;
    private String tel;
    private String phone;
    private Date birth ;
    private String zipcode;
    private String addr1;
    private String addr2;
    private Character mailyn;
    private Date regdate;
    private Character isadmin;
}
