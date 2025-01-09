package com.bxgs.gallery.service;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.mapper.FaqMapper;
import com.bxgs.gallery.model.FaqVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService {
    private final FaqMapper faqMapper;

    // 전체조회
    public List<FaqVO> selectAll(Pagination pg) {
        pg.setTotalRecord(faqMapper.totalCount(pg));
        return faqMapper.selectAll(pg);
    }

    // 상세조회
    public FaqVO selectOne(int no) {
        return faqMapper.selectOne(no);
    }

    // 글등록
    public void insert(FaqVO faq) {
        faqMapper.insert(faq);
    }

    // 글수정
    public void update(FaqVO faq) {
        faqMapper.update(faq);
    }

    // 글삭제
    public void delete(int no) {
        faqMapper.delete(no);
    }
}
