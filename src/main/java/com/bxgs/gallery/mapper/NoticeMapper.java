package com.bxgs.gallery.mapper;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.NoticeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NoticeMapper {
    // 전체조회
    List<NoticeVO> selectAll(Pagination pg);
    // 글 개수
    int totalCount(Pagination pg);
    // 상세보기
    NoticeVO selectOne(int no);
    // 글등록
    void insert(NoticeVO notice);
    // 글수정
    void update(NoticeVO notice);
    // 글삭제
    void delete(int no);
}
