package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.FileStorage;
import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.FileVO;
import com.bxgs.gallery.model.NoticeVO;
import com.bxgs.gallery.service.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/notice")
public class NoticeController {
    private final NoticeService noticeService;
    private final FileStorage fileStorage;

    @GetMapping("/list")
    public void list(@RequestParam(defaultValue = "1") int pageNum,
                     HttpServletRequest request,
                     String searchType,
                     String keyword,
                     Model model) {

        Pagination pg = new Pagination();
        pg.setPageNum(pageNum);

        if (keyword != null) {
            Map<String, String> params = new HashMap<>();
            params.put("searchType", searchType);
            params.put("keyword", keyword);
            pg.setSearchMap(params);
        }

        int totalCount = noticeService.totalCount(pg);
        pg.setTotalRecord(totalCount);

        model.addAttribute("list", noticeService.selectAll(pg));
        model.addAttribute("total", totalCount);
        model.addAttribute("paging", pg.paging(request));
    }

    @GetMapping("/view/{no}")
    public String view(@PathVariable("no") int no, Model model) {
        model.addAttribute("link", "/notice");
        model.addAttribute("data", noticeService.selectOne(no));
        return "notice/view";
    }

    @GetMapping("/write")
    public void write() {}

    @GetMapping("/update/{no}")
    public String update(@PathVariable("no") int no, Model model) {
        model.addAttribute("notice", noticeService.selectOne(no));
        return "notice/update";
    }

    @PostMapping("/write")
    public String write(@ModelAttribute NoticeVO vo, @RequestParam("file") MultipartFile[] files) {
            List<FileVO> list = fileStorage.uploadFiles(files);
        if (!list.isEmpty()) {
            vo.setOfile(list.getFirst().getOfile());
            vo.setNfile(list.getFirst().getNfile());
        }

        noticeService.insert(vo);
        return "redirect:/notice/list";
    }

    @PostMapping("/update")
    public String update(@ModelAttribute NoticeVO vo, @RequestParam("file") MultipartFile[] files) {
        String nFile = noticeService.selectOne(vo.getNo()).getNfile();

        List<FileVO> list = fileStorage.uploadFiles(files);
        if (!list.isEmpty()) {
            vo.setOfile(list.getFirst().getOfile());
            vo.setNfile(list.getFirst().getNfile());
        }

        noticeService.update(vo);

        if (nFile != null) fileStorage.deleteFile(nFile);

        return "redirect:/notice/list";
    }

    @GetMapping("/delete/{no}")
    public String delete(@PathVariable("no") int no) {
        NoticeVO vo = noticeService.selectOne(no);
        if (vo != null) {
            noticeService.delete(no);
            fileStorage.deleteFile(vo.getNfile());
        }

        return "redirect:/notice/list";
    }

    @GetMapping("/download/{no}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Integer no) {
        NoticeVO vo = noticeService.selectOne(no);
        if (vo != null) {
            return fileStorage.downloadFile(vo.getOfile(), vo.getNfile());
        }

        return ResponseEntity.notFound().build();
    }

}
