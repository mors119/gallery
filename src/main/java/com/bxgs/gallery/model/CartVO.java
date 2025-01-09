package com.bxgs.gallery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartVO {
  private int no;
  private String amount;
  private String blank;
  private String frame;
  private String media;
  private String goods_no;
  private String retouch;
  private String size;
}
