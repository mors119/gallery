package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistVO {
    private Integer no;
    private String img;
    private String name_kr;
    private String name_en;
    private String loc;
    private String born;
    private String death;
    private String pop;
    private String descr;
    private Date regdate;
}
