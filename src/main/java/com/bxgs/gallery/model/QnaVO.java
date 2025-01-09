package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QnaVO {
    private Integer no;
    private String title;
    private String answer;
    private String content;
    private Date regdate;
    private String name;
    private String id;
    private String ofile;
    private String nfile;
    private Integer prev_no;
    private String prev_title;
    private Integer next_no;
    private String next_title;
}