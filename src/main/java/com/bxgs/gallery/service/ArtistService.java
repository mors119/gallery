package com.bxgs.gallery.service;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.mapper.ArtistMapper;
import com.bxgs.gallery.model.ArtistVO;
import com.bxgs.gallery.model.ShopVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistMapper artistMapper;

    // 전체조회
    public List<ArtistVO> selectAll(Pagination pg) {
        return artistMapper.selectAll(pg);
    }

    // 전체글 개수
    public int totalCount(Pagination pg) {
        return artistMapper.totalCount(pg);
    }

    // 상세조회
    public ArtistVO selectOne(int no) {
        return artistMapper.selectOne(no);
    }

    // 작가의 작품리스트
    public List<ShopVO> selectGoods(int no) {
        return artistMapper.selectGoods(no);
    }
}
