package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventVO {
    private Integer no;
    private String title;
    private String poster;
    private String sub;
    private String content;
    private Date startdate;
    private Date enddate;
    private Date regdate;
    private String ofile;
    private String nfile;
    private Integer prev_no;
    private String prev_title;
    private Integer next_no;
    private String next_title;
    private String isend;
}
