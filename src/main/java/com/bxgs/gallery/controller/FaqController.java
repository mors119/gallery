package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.service.FaqService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/faq")
public class FaqController {
    private final FaqService faqService;

    @GetMapping("/list")
    public void page(@RequestParam(defaultValue = "1") int pageNum,
                       HttpServletRequest request,
                       String cate,
                       String keyword,
                       Model model) {

        Pagination pg = new Pagination();
        pg.setPageNum(pageNum);
        pg.setPageSize(7);

        Map<String, String> map = new HashMap<>();

        if (cate != null) {
            String tmp = switch (cate) {
                case "order" -> "주문";
                case "delivery" -> "배송";
                case "transfer" -> "교환";
                case "member" -> "회원";
                case "site" -> "사이트";
                case "etc" -> "기타";
                default -> "";
            };

            map.put("cate", tmp);
        }

        if (keyword != null) map.put("keyword", keyword);

        pg.setSearchMap(map);

        model.addAttribute("list", faqService.selectAll(pg));
        model.addAttribute("paging", pg.paging(request));
    }
}
