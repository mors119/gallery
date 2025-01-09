package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaqVO {
    private Integer no;
    private String cate;
    private String question;
    private String answer;
    private Date regdate;
}
