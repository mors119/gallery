package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.FileStorage;
import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.FileVO;
import com.bxgs.gallery.model.LoginVO;
import com.bxgs.gallery.model.QnaVO;
import com.bxgs.gallery.service.QnaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qna")
public class QnaController {
    private final QnaService qnaService;
    private final FileStorage fileStorage;

    @GetMapping({"/list", "/write"})
    public void page(@RequestParam(defaultValue = "1") int pageNum,
                     HttpServletRequest request,
                     Model model) {

        Pagination pg = new Pagination();
        pg.setPageNum(pageNum);
        int totalCount = qnaService.totalCount(pg);
        pg.setTotalRecord(totalCount);

        model.addAttribute("list", qnaService.selectAll(pg));
        model.addAttribute("total", totalCount);
        model.addAttribute("paging", pg.paging(request));
    }

    @GetMapping("/view/{no}")
    public String view(@PathVariable("no") Integer no, Model model) {
        model.addAttribute("qna", qnaService.selectQna(no));
        return "qna/view";
    }

    @PostMapping("/insert")
    public String insert(@ModelAttribute QnaVO vo,
                         @RequestParam("file") MultipartFile[] files,
                         HttpSession session) {

        LoginVO user = (LoginVO) session.getAttribute("user");
        if (user != null) vo.setId(user.getId());

        List<FileVO> list = fileStorage.uploadFiles(files);
        if (!list.isEmpty()) {
            vo.setOfile(list.getFirst().getOfile());
            vo.setNfile(list.getFirst().getNfile());
        }

        qnaService.insert(vo);
        return "redirect:/qna/list";
    }

    @GetMapping("/update/{no}")
    public String update(@PathVariable("no") Integer no, Model model) {
        model.addAttribute("qna", qnaService.selectQna(no));
        return "qna/update";
    }

    @PostMapping("/update")
    public String update(@ModelAttribute QnaVO vo, @RequestParam("file") MultipartFile[] files) {
        String nFile = qnaService.selectQna(vo.getNo()).getNfile();

        List<FileVO> list = fileStorage.uploadFiles(files);
        if (!list.isEmpty()) {
            vo.setOfile(list.getFirst().getOfile());
            vo.setNfile(list.getFirst().getNfile());
        }

        qnaService.update(vo);

        // 수정시 기존 파일 삭제
        if (nFile != null) fileStorage.deleteFile(nFile);

        return "redirect:/qna/list";
    }

    @DeleteMapping("/delete/{no}")
    public @ResponseBody int delete(@PathVariable("no") Integer no) {
        QnaVO vo = qnaService.selectQna(no);
        int result = 0;
        if (vo != null) result = qnaService.delete(no);
        if (result > 0) {
            fileStorage.deleteFile(vo.getNfile());
        }

        return result;
    }

    @GetMapping("/download/{no}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Integer no) {
        QnaVO vo = qnaService.selectQna(no);
        if (vo != null) {
            return fileStorage.downloadFile(vo.getOfile(), vo.getNfile());
        }

        return ResponseEntity.notFound().build();
    }

}
