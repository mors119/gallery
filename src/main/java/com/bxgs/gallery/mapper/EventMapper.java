package com.bxgs.gallery.mapper;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.EventVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EventMapper {
    // 전체조회
    List<EventVO> selectAll(Pagination pagination);
    // 전체글 개수
    int totalCount(Pagination pagination);
    // 상세보기
    EventVO selectOne(int no);
    // 글등록
    void insert(EventVO vo);
    // 글수정
    void update(EventVO vo);
    // 글삭제
    void delete(int no);
}
