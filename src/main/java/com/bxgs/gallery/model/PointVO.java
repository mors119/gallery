package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class PointVO {
    private Integer no;
    private String name;
    private int point;
    private int use_point;
    private Date enddate;
    private Date regdate;
    private String member_id;
}
