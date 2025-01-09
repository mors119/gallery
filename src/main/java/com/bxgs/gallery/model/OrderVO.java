package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderVO {
    private String no;
    private String member_id;
    private String cart_no;
    private String name;
    private String phone;
    private String tel;
    private String zipcode;
    private String addr;
    private String addr2;
    private String request;
    private String price;
    private String pay_name;
    private String status;
    private LocalDateTime regdate;
}
