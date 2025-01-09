package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataVO {
    private int no;
    private int goods_no;
    private String goods_q_email;
    private String goods_q_hp;
    private String goods_q_tit;
    private String content;
    private String member_id;
}
