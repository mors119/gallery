package com.bxgs.gallery.service;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.mapper.EventMapper;
import com.bxgs.gallery.model.EventVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventMapper eventMapper;

    // 전체조회
    public List<EventVO> selectAll(Pagination pagination) {
        pagination.setTotalRecord(eventMapper.totalCount(pagination));
        return eventMapper.selectAll(pagination);
    }

    // 상세보기
    public EventVO selectOne(int no) {
        return eventMapper.selectOne(no);
    }

    // 글등록
    public void insert(EventVO eventVO) {
        eventMapper.insert(eventVO);
    }

    // 글수정
    public void update(EventVO eventVO) {
        eventMapper.update(eventVO);
    }

    // 글삭제
    public void delete(int no) {
        eventMapper.delete(no);
    }
}
