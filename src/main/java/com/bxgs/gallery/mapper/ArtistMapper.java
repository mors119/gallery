package com.bxgs.gallery.mapper;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.ArtistVO;
import com.bxgs.gallery.model.ShopVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ArtistMapper {
    // 전체조회
    List<ArtistVO> selectAll(Pagination pagination);
    // 전체글 개수
    int totalCount(Pagination pagination);
    // 상세조회
    ArtistVO selectOne(int no);
    // 작가의 작품 리스트
    List<ShopVO> selectGoods(int no);
}
