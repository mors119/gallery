package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CouponVO {
    private String no;
    private String name;
    private String venefit;
    private Date startdate;
    private Date enddate;
    private Date regdate;
    private String member_id;
}
