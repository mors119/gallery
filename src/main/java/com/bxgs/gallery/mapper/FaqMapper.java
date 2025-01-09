package com.bxgs.gallery.mapper;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.FaqVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FaqMapper {
    // 전체조회
    List<FaqVO> selectAll(Pagination pg);
    // 전체글 개수
    int totalCount(Pagination pg);
    // 상세조회
    FaqVO selectOne(int no);
    // 글쓰기
    void insert(FaqVO faq);
    // 글수정
    void update(FaqVO faq);
    // 글삭제
    void delete(int no);
}
