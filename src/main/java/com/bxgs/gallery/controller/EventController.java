package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.EventVO;
import com.bxgs.gallery.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/event")
public class EventController {
    private final EventService eventService;

    @GetMapping("/list")
    public void list(@RequestParam(defaultValue = "1") int pageNum,
                     HttpServletRequest request,
                     String isEnd,
                     Model model) {

        Pagination pg = new Pagination();
        pg.setPageNum(pageNum);
        pg.setPageSize(6);

        List<EventVO> list = eventService.selectAll(pg);

        if (isEnd != null) {
            list = list.stream()
                    .filter(v -> Objects.equals(v.getIsend(), isEnd))
                    .collect(Collectors.toList());
        }

        model.addAttribute("list", list);
        model.addAttribute("paging", pg.paging(request));
    }

    // 상세보기 페이지는 공지사항과 같이 사용함!
    @GetMapping("/view/{no}")
    public String view(@PathVariable("no") int no, Model model) {
        model.addAttribute("data", eventService.selectOne(no));
        model.addAttribute("link", "/event");

        return "notice/view";
    }
}
