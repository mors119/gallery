package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.LoginVO;
import com.bxgs.gallery.model.OrderVO;
import com.bxgs.gallery.model.PointVO;
import com.bxgs.gallery.service.LoginService;
import com.bxgs.gallery.service.QnaService;
import com.bxgs.gallery.service.ShopService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.Session;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/my")
public class MyPageController {
    private final LoginService loginService;
    private final ShopService shopService;
    private final QnaService qnaService;

    @GetMapping("/main")
    public String myPage(Model model, HttpServletRequest request) {
        return handleUserSession(request, model, () -> {
            Pagination pg = createPaginationForUser(getLoginInfo(request, model));
            model.addAttribute("wishList", shopService.selectWish(pg));
            return "my_page/my_main";
        });
    }

    @GetMapping("/inquiry")
    public String inquiry(Model model, HttpServletRequest request, HttpSession session) {
        LoginVO user = (LoginVO) session.getAttribute("user");
        List<Map<String, Object>> parsedList = shopService.myOrderAll(user.getId());
        List<Map<String, String>> processedList = new ArrayList<>();

        if(parsedList != null) {
            for (Map<String, Object> listMap : parsedList) {
                Map<String, String> resultMap = new HashMap<>();

                // 첫 번째 값만 추출
                String goodsNoRaw = listMap.get("goods_no") != null ? listMap.get("goods_no").toString() : "";
                String[] goodsNos = goodsNoRaw.split(",");
                resultMap.put("goods_no", goodsNos.length > 0 ? goodsNos[0] : "");

                String nameRaw = listMap.get("name_kr") != null ? listMap.get("name_kr").toString() : "";
                String[] names = nameRaw.split(",");
                resultMap.put("name_kr", names.length > 0 ? names[0] : "");

                String imgRaw = listMap.get("img") != null ? listMap.get("img").toString() : "";
                String[] imgs = imgRaw.split(",");
                resultMap.put("img", imgs.length > 0 ? imgs[0] : "");

                // 추가적인 데이터 처리
                resultMap.put("price", listMap.get("price") != null ? listMap.get("price").toString() : "");
                resultMap.put("regdate", listMap.get("regdate") != null ? listMap.get("regdate").toString() : "");
                resultMap.put("title", listMap.get("title") != null ? listMap.get("title").toString() : "");
                resultMap.put("no", listMap.get("no") != null ? listMap.get("no").toString() : "");
                processedList.add(resultMap);
            }
        }

         System.out.println("parsedList = " + processedList);
        model.addAttribute("parsedList", processedList);
        return handleUserSession(request, model, () -> "my_page/order_inquiry");
    }

    @GetMapping("/wish")
    public String myWish(@RequestParam(defaultValue = "1") int pageNum,
                         HttpServletRequest request,
                         Model model) {

        return handleUserSession(request, model, () -> {
            LoginVO login = getLoginInfo(request, model);
            Pagination pg = createPaginationForUser(login);
            pg.setPageNum(pageNum);
            model.addAttribute("wishList", shopService.selectWish(pg));
            model.addAttribute("paging", pg.paging(request));
            return "my_page/wish";
        });
    }

    @GetMapping("/coupon")
    public String myCoupon(HttpServletRequest request, Model model) {
        return handleUserSession(request, model, () -> "my_page/coupon");
    }

    @GetMapping("/coupon_done")
    public String myCouponDone(HttpServletRequest request, Model model) {
        return handleUserSession(request, model, () -> {
            LoginVO login = getLoginInfo(request, model);
            model.addAttribute("coupons", loginService.selectCoupon(login.getId(), "Y"));
            return "my_page/coupon_done";
        });
    }

    @GetMapping("/mileage")
    public String myMileage(String startdate, String enddate, Model model, HttpServletRequest request) {
        return handleUserSession(request, model, () -> {
            LoginVO login = getLoginInfo(request, model);
            if (startdate != null && enddate != null) {
                model.addAttribute("points", loginService.selectPoint(login.getId(), startdate, enddate));
            }
            return "my_page/mileage";
        });
    }

    @GetMapping("/qna")
    public String myQna(@RequestParam(defaultValue = "1") int pageNum,
                        HttpServletRequest request,
                        Model model) {

        return handleUserSession(request, model, () -> {
            LoginVO login = getLoginInfo(request, model);
            Pagination pg = createPaginationForUser(login);
            pg.setPageNum(pageNum);
            int totalCount = qnaService.totalCountById(pg);
            pg.setTotalRecord(totalCount);
            model.addAttribute("qnaList", qnaService.selectAllById(pg));
            model.addAttribute("totalCount", totalCount);
            model.addAttribute("paging", pg.paging(request));
            return "my_page/qna";
        });
    }

    @GetMapping("/info_change")
    public String myInfoChange(Model model, HttpServletRequest request) {
        return handleUserSession(request, model, () -> "my_page/info_change");
    }

    @GetMapping("/info_update")
    public String myInfoUpdate(Model model, HttpServletRequest request) {
        return handleUserSession(request, model, () -> "my_page/info_update");
    }

    @GetMapping("/info_delete")
    public String myInfoDelete(Model model, HttpServletRequest request) {
        return handleUserSession(request, model, () -> "my_page/info_delete");
    }

    @GetMapping("/deleteWish")
    public String myDeleteWish(@RequestParam("no") String noArr, String like, HttpServletRequest request, Model model) {
        return handleUserSession(request, model, () -> {
            LoginVO login = getLoginInfo(request, model);
            int[] intArr = Arrays.stream(noArr.split(","))
                    .mapToInt(Integer::parseInt)
                    .toArray();
            shopService.deleteWish(login.getId(), intArr);

            if (like != null) return "redirect:/my/main";
            return "redirect:/my/wish";
        });
    }

    private LoginVO getLoginInfo(HttpServletRequest request, Model model) {
        LoginVO user = (LoginVO) request.getSession().getAttribute("user");

        if (user != null) {
            List<PointVO> points = loginService.selectPoint(user.getId(), null, null);
            int sum = points.stream().mapToInt(PointVO::getPoint).sum();
            int use = points.stream().mapToInt(PointVO::getUse_point).sum();

            model.addAttribute("request", request);
            model.addAttribute("coupons", loginService.selectCoupon(user.getId(), null));
            model.addAttribute("points", points);
            model.addAttribute("credit", (sum - use));
        }

        return user;
    }

    private Pagination createPaginationForUser(LoginVO login) {
        Pagination pg = new Pagination();
        pg.setSearchMap(Collections.singletonMap("id", login.getId()));
        return pg;
    }

    private String handleUserSession(HttpServletRequest request, Model model, SessionHandler handler) {
        LoginVO user = getLoginInfo(request, model);
        return user == null ? "redirect:/login" : handler.handle();
    }

    @FunctionalInterface
    private interface SessionHandler {
        String handle();
    }

}