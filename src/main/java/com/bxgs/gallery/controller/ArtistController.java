package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.service.ArtistService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/artist")
public class ArtistController {
    private final ArtistService artistService;

    @GetMapping("/list")
    public void list(@RequestParam(defaultValue = "1") int pageNum,
                     HttpServletRequest request,
                     String keyword,
                     Model model) {

        Pagination pg = new Pagination();
        pg.setPageSize(12);
        pg.setPageNum(pageNum);

        if (keyword != null) {
            Map<String, String> map = new HashMap<>();
            map.put("keyword", keyword);
            pg.setSearchMap(map);
        }

        int totalCount = artistService.totalCount(pg);
        pg.setTotalRecord(totalCount);

        model.addAttribute("list", artistService.selectAll(pg));
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("paging", pg.paging(request));
    }

    @GetMapping("/info/{no}")
    public String info(@PathVariable int no, Model model) {
        model.addAttribute("author", artistService.selectOne(no));
        model.addAttribute("goods", artistService.selectGoods(no));
        return "artist/info";
    }
}
