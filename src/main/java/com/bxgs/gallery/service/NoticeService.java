package com.bxgs.gallery.service;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.mapper.NoticeMapper;
import com.bxgs.gallery.model.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeMapper noticeMapper;

    // 전체조회
    public List<NoticeVO> selectAll(Pagination pg) {
        return noticeMapper.selectAll(pg);
    }

    // 전체글 개수
    public int totalCount(Pagination pg) {
        return noticeMapper.totalCount(pg);
    }

    // 상세보기
    public NoticeVO selectOne(int no) {
        return noticeMapper.selectOne(no);
    }

    // 글쓰기
    public void insert(NoticeVO notice) {
        noticeMapper.insert(notice);
    }

    // 글수정
    public void update(NoticeVO notice) {
        noticeMapper.update(notice);
    }

    // 글삭제
    public void delete(int no) {
        noticeMapper.delete(no);
    }
}
