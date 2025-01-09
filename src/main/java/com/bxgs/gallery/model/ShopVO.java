package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopVO {
    private Integer no;
    private int price;
    private int author_no;
    private int qty;
    private int rating;
    private String title;
    private String content;
    private String poster;
    private String descr;
    private String name_kr;
    private String name_en;
    private String id;
    private String member_id;
    private String question;
    private String answer;
    private Date regdate;
}
