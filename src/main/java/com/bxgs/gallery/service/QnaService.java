package com.bxgs.gallery.service;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.mapper.QnaMapper;
import com.bxgs.gallery.model.QnaVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QnaService {
    private final QnaMapper qnaMapper;

    // 전체조회
    public List<QnaVO> selectAll(Pagination pg) {
        return qnaMapper.selectAll(pg);
    }

    // 전체글 개수
    public int totalCount(Pagination pg) {
        return qnaMapper.totalCount(pg);
    }

    // 글등록
    public void insert(QnaVO vo) {
        qnaMapper.insert(vo);
    }

    // 상세보기
    public QnaVO selectQna(int no) {
        return qnaMapper.selectQna(no);
    }

    // 글수정
    public void update(QnaVO vo) {
        qnaMapper.update(vo);
    }

    // 글삭제
    public int delete(int no) {
        return qnaMapper.delete(no);
    }

    // 작성자별 조회
    public List<QnaVO> selectAllById(Pagination pg) {
        return qnaMapper.selectAllById(pg);
    }

    // 작성자별 조회 개수
    public int totalCountById(Pagination pg) {
        return qnaMapper.totalCountById(pg.getSearchMap().get("id"));
    }

}
