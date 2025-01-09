package com.bxgs.gallery.mapper;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.QnaVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface QnaMapper {
    // 전체조회
    List<QnaVO> selectAll(Pagination pg);
    // 글개수
    int totalCount(Pagination pg);
    // 상세보기
    QnaVO selectQna(int no);
    // 글등록
    void insert(QnaVO vo);
    // 글수정
    void update(QnaVO vo);
    // 글삭제
    int delete(int no);
    // 작성자별 조회
    List<QnaVO> selectAllById(Pagination pg);
    // 작성자별 조회 개수
    int totalCountById(String id);
}
