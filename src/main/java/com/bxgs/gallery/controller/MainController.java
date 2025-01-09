package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.service.ShopService;
import com.bxgs.gallery.service.SqlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class MainController {
    private final SqlService sqlService;
    private final ShopService shopService;

    private static final Map<String, String> params = new HashMap<>();
    private static int pageSize = 9;

    @GetMapping("/")
    public String home(HttpServletRequest httpServletRequest) {
        // 세션 값 없으면 null return
        HttpSession session = httpServletRequest.getSession(false);
        if (session != null) {
            session.getAttribute("userId");
        }
        return "main";
    }

    // SQL 쿼리문 자동실행
    @GetMapping("/execute-sql")
    public String executeSql() {
        sqlService.executeSql("create");
        sqlService.executeSql("insert");
        return "redirect:/";
    }

    @GetMapping("/search")
    public String search(@RequestParam(defaultValue = "1") int pageNum,
                         HttpServletRequest request,
                         String type,
                         String keyword,
                         String searchWord,
                         String size,
                         String sort,
                         Model model) {

        if (size != null) pageSize = Integer.parseInt(size);

        Pagination pg = new Pagination();
        pg.setPageNum(pageNum);
        pg.setPageSize(pageSize);

        if ("all".equals(keyword)) {
            keyword = null;
            params.remove("keyword");
        }

        if (sort != null) {
            params.put("sort", sort);
            String tmp = switch (sort) {
                case "pop" -> "인기순";
                case "review" -> "후기순";
                case "rating" -> "평점순";
                case "date" -> "등록순";
                case "high" -> "높은가격순";
                case "low" -> "낮은가격순";
                default -> "";
            };
            model.addAttribute("sort", tmp);
        }

        if (type != null) params.put("type", type);
        if (keyword != null) params.put("keyword", keyword);
        if (searchWord != null) params.put("searchWord", searchWord);

        pg.setSearchMap(params);

        int totalCount = shopService.totalCount(pg);
        pg.setTotalRecord(totalCount);

        model.addAttribute("list", shopService.selectAll(pg));
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("paging", pg.paging(request));
        model.addAttribute("size", pageSize);

        return "search/list";
    }

    @GetMapping("/about")
    public String about() {
        return "about/about";
    }
}
