package com.bxgs.gallery.controller;

import com.bxgs.gallery.common.FileStorage;
import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.*;
import com.bxgs.gallery.service.LoginService;
import com.bxgs.gallery.service.ShopService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/shop")
public class ShopController {
    private final ShopService shopService;
    private final LoginService loginService;
    private final FileStorage fileStorage;
    private Pagination pagination;

    private static final int[] counting = {9, 9};

    @GetMapping("/best")
    public void best(Model model, HttpSession session) {
        pagination = new Pagination();
        pagination.setPageSize(5);

        getWishList(model, session);

        model.addAttribute("list", shopService.selectAll(pagination));
    }

    @GetMapping("/goods")
    public void newShop(Model model, HttpSession session) {
        pagination = new Pagination();
        pagination.setPageSize(5);

        Map<String, String> map = new HashMap<>();
        map.put("type", "goods");
        pagination.setSearchMap(map);

        getWishList(model, session);

        model.addAttribute("list", shopService.selectAll(pagination));
    }

    @GetMapping("/genre")
    public void genre(@RequestParam(defaultValue = "1") int pageNum,
                      HttpServletRequest request,
                      String keyword,
                      Model model) {

        pagination = new Pagination();
        pagination.setPageSize(12);
        pagination.setPageNum(pageNum);

        if (keyword != null) {
            Map<String, String> map = new HashMap<>();
            map.put("type", "genre");
            map.put("keyword", keyword);
            pagination.setSearchMap(map);
        }

        int totalCount = shopService.totalCount(pagination);
        pagination.setTotalRecord(totalCount);

        model.addAttribute("list", shopService.selectAll(pagination));
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("paging", pagination.paging(request));
    }

    @GetMapping("/subject")
    public void subject(@RequestParam(defaultValue = "1") int pageNum,
                        HttpServletRequest request,
                        String keyword,
                        Model model) {

        pagination = new Pagination();
        pagination.setPageSize(12);
        pagination.setPageNum(pageNum);

        if (keyword != null) {
            Map<String, String> map = new HashMap<>();
            map.put("type", "subject");
            map.put("keyword", keyword);
            pagination.setSearchMap(map);
        }

        int totalCount = shopService.totalCount(pagination);
        pagination.setTotalRecord(totalCount);

        model.addAttribute("list", shopService.selectAll(pagination));
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("paging", pagination.paging(request));
    }

    @GetMapping("/view/{no}")
    public String view(@PathVariable("no") int no, Model model, String order, HttpSession session) {
        List<ShopVO> reviewList = shopService.selectAllReview(no, order);

        // 리뷰 총 개수
        int totalReviews = reviewList.size();

        // 별점 당 백분율 계산
        // 별점 당 리뷰가 없으면 0 반환
        int likeRating = (int) reviewList.stream().filter(v -> v.getRating() >= 4).count();
        double percentRating = totalReviews > 0 ? (double) likeRating / totalReviews * 100 : 0;

        int fiveRating = (int) reviewList.stream().filter(v -> v.getRating() == 5).count();
        double percentFiveRating = totalReviews > 0 ? (double) fiveRating / totalReviews * 100 : 0;

        int fourRating = (int) reviewList.stream().filter(v -> v.getRating() == 4).count();
        double percentFourRating = totalReviews > 0 ? (double) fourRating / totalReviews * 100 : 0;

        int threeRating = (int) reviewList.stream().filter(v -> v.getRating() == 3).count();
        double percentThreeRating = totalReviews > 0 ? (double) threeRating / totalReviews * 100 : 0;

        int twoRating = (int) reviewList.stream().filter(v -> v.getRating() == 2).count();
        double percentTwoRating = totalReviews > 0 ? (double) twoRating / totalReviews * 100 : 0;

        int oneRating = (int) reviewList.stream().filter(v -> v.getRating() == 1).count();
        double percentOneRating = totalReviews > 0 ? (double) oneRating / totalReviews * 100 : 0;

        // 평균 평점 계산
        double avg = reviewList.stream().mapToInt(ShopVO::getRating).average().orElse(0);

        // 찜리스트 등록 여부확인
        LoginVO user = (LoginVO) session.getAttribute("user");
        boolean isWish = false;
        if (user != null) {
            isWish = shopService.selectIsWish(user.getId(), no);
        }

        model.addAttribute("viewOne", shopService.selectByGoods(no));
        model.addAttribute("randomPic", shopService.randomPicture(no));
        model.addAttribute("reviewAll", shopService.selectAllReview(no, order));
        model.addAttribute("totalReview", shopService.totalReview(no));
        model.addAttribute("totalAsk", shopService.totalAsk(no));
        model.addAttribute("askAll", shopService.selectAllAsk(no));
        model.addAttribute("avgRating", Math.round(avg * 10.0) / 10.0);
        model.addAttribute("totalPersent", Math.round(percentRating * 10.0) / 10.0);
        model.addAttribute("fivePersent", Math.round(percentFiveRating * 10.0) / 10.0);
        model.addAttribute("fourPersent", Math.round(percentFourRating * 10.0) / 10.0);
        model.addAttribute("threePersent", Math.round(percentThreeRating * 10.0) / 10.0);
        model.addAttribute("twoPersent", Math.round(percentTwoRating * 10.0) / 10.0);
        model.addAttribute("onePersent", Math.round(percentOneRating * 10.0) / 10.0);
        model.addAttribute("isWish", isWish);

        return "shop/view";
    }

    @GetMapping("/review_write/{no}")
    public String reviewWrite(@PathVariable("no") int no, Model model, HttpSession session) {
        model.addAttribute("viewOne", shopService.selectByGoods(no));

        return "shop/review_write";
    }

    @GetMapping("/review_update/{no}")
    public String reviewUpdate(@PathVariable("no") int no, Model model, HttpSession session) {
        model.addAttribute("review", shopService.selectOneReview(no));

        return "shop/review_update";
    }

    @GetMapping("/qna_write/{no}")
    public String write(@PathVariable("no") int no, Model model, HttpSession session) {
        model.addAttribute("viewOne", shopService.selectByGoods(no));

        return "shop/qna_write";
    }

    @GetMapping("/qna_update/{no}")
    public String update(@PathVariable("no") int no, Model model, HttpSession session) {
        model.addAttribute("viewOne", shopService.selectByGoods(no));
        model.addAttribute("askOne", shopService.selectByAsk(no));

        return "shop/qna_update";
    }

    @GetMapping("/cart")
    public String cart(Model model, HttpSession session) {
        if (session.getAttribute("user") != null) {
            model.addAttribute("user", 1);
        } else {
            model.addAttribute("user", 0);
        }
        return "shop/cart";
    }

    @GetMapping("/painting")
    public void painting(@RequestParam(defaultValue = "1") int pageNum,
                         HttpServletRequest request,
                         String cnt,
                         String sort,
                         Model model) {

        if (cnt != null) counting[0] = Integer.parseInt(cnt);

        pagination = new Pagination();
        pagination.setPageSize(counting[0]);
        pagination.setPageNum(pageNum);

        Map<String, String> map = new HashMap<>();
        map.put("type", "painting");

        if (sort != null) {
            map.put("sort", sort);
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

        pagination.setSearchMap(map);

        int totalCount = shopService.totalCount(pagination);
        pagination.setTotalRecord(totalCount);

        getWishList(model, request.getSession());

        model.addAttribute("list", shopService.selectAll(pagination));
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("paging", pagination.paging(request));
        model.addAttribute("cnt", counting[0]);
    }

    @GetMapping("/picture")
    public void picture(@RequestParam(defaultValue = "1") int pageNum,
                        HttpServletRequest request,
                        String cnt,
                        String sort,
                        Model model) {

        if (cnt != null) counting[1] = Integer.parseInt(cnt);

        pagination = new Pagination();
        pagination.setPageSize(counting[1]);
        pagination.setPageNum(pageNum);

        if (cnt != null) pagination.setPageSize(Integer.parseInt(cnt));

        Map<String, String> map = new HashMap<>();
        map.put("type", "picture");

        if (sort != null) {
            map.put("sort", sort);
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

        pagination.setSearchMap(map);

        int totalCount = shopService.totalCount(pagination);
        pagination.setTotalRecord(totalCount);

        getWishList(model, request.getSession());

        model.addAttribute("list", shopService.selectAll(pagination));
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("paging", pagination.paging(request));
        model.addAttribute("cnt", counting[1]);
    }

    // 주문 페이지 이동
    @GetMapping("/order")
    public String order(Model model, HttpSession session, String check) {
        if (session.getAttribute("user") != null) {
            LoginVO user = (LoginVO)session.getAttribute("user");
            List<PointVO> points = loginService.selectPoint(user.getId(), null, null);
            int sum = points.stream().mapToInt(PointVO::getPoint).sum();
            int use = points.stream().mapToInt(PointVO::getUse_point).sum();

            model.addAttribute("coupons", loginService.selectCoupon(user.getId(), null));
            model.addAttribute("points", points);
            model.addAttribute("credit", (sum - use));
            model.addAttribute("user", user);
            return "shop/order";
        } else {
            if(check != null) {
                return "shop/order";
            } else {
                return "redirect:/login";
            }
        }
    }

    // 주문 하기
    @PostMapping("/order")
    public String order(OrderVO orderVO, RedirectAttributes rttr) {
        System.out.println("orderVO = " + orderVO);
        String no = shopService.insertOrder(orderVO);

        rttr.addFlashAttribute("no", no);
        return "redirect:/shop/order_info";
    }

    // 주문 상세 조회
    @GetMapping("/order_info")
    public String order_info(@ModelAttribute("no") String no, Model model, RedirectAttributes rttr,  WebRequest webRequest, HttpSession session) {
        Map<String, Object> rawOrder = shopService.orderOne(no);
        List<Map<String, String>> parsedOrder = new ArrayList<>();
        if(rawOrder != null) {

            String imgRaw = rawOrder.get("img") != null ? rawOrder.get("img").toString() : "";
            String[] imgs = imgRaw.isEmpty() ? new String[0] : imgRaw.split(",");

            String goodsNoRaw = rawOrder.get("goods_no") != null ? rawOrder.get("goods_no").toString() : "";
            String[] goodsNos = goodsNoRaw.isEmpty() ? new String[0] : goodsNoRaw.split(",");

            String nameRaw = rawOrder.get("name_kr") != null ? rawOrder.get("name_kr").toString() : "";
            String[] names = nameRaw.isEmpty() ? new String[0] : nameRaw.split(",");

            String sizeRaw = rawOrder.get("sizes") != null ? rawOrder.get("sizes").toString() : "";
            String[] sizes = sizeRaw.isEmpty() ? new String[0] : sizeRaw.split(",");

            String mediaRaw = rawOrder.get("media") != null ? rawOrder.get("media").toString() : "";
            String[] medias = mediaRaw.isEmpty() ? new String[0] : mediaRaw.split(",");

            String retouchesRaw = rawOrder.get("retouches") != null ? rawOrder.get("retouches").toString() : "";
            String[] retouches = retouchesRaw.isEmpty() ? new String[0] : retouchesRaw.split(",");

            String framesRaw = rawOrder.get("frames") != null ? rawOrder.get("frames").toString() : "";
            String[] frames = framesRaw.isEmpty() ? new String[0] : framesRaw.split(",");

            String blanksRaw = rawOrder.get("blanks") != null ? rawOrder.get("blanks").toString() : "";
            String[] blanks = blanksRaw.isEmpty() ? new String[0] : blanksRaw.split(",");

            String priceRaw = rawOrder.get("unit_price") != null ? rawOrder.get("unit_price").toString() : "";
            String[] unitPrices = priceRaw.isEmpty() ? new String[0] : priceRaw.split(",");

            String amountsRaw = rawOrder.get("amounts") != null ? rawOrder.get("amounts").toString() : "";
            String[] amounts = amountsRaw.isEmpty() ? new String[0] : amountsRaw.split(",");

            String titlesRaw = rawOrder.get("title") != null ? rawOrder.get("title").toString() : "";
            String[] titles = titlesRaw.isEmpty() ? new String[0] : titlesRaw.split(",");

            for (int i = 0; i < goodsNos.length; i++) {
                Map<String, String> item = new HashMap<>();
                item.put("goods_no", goodsNos[i]);
                item.put("img", i < imgs.length ? imgs[i] : "");
                item.put("name_kr", i < names.length ? names[i] : "");
                item.put("size", i < sizes.length ? sizes[i] : "");
                item.put("media", i < medias.length ? medias[i] : "");
                item.put("retouches", i < retouches.length ? retouches[i] : "");
                item.put("frame", i < frames.length ? frames[i] : "");
                item.put("blank", i < blanks.length ? blanks[i] : "");
                item.put("unit_price", i < unitPrices.length ? unitPrices[i] : "");
                item.put("amount", i < amounts.length ? amounts[i] : "");
                item.put("title", i < titles.length ? titles[i] : "");
                parsedOrder.add(item);
            }
        }


        String referer = webRequest.getHeader("referer");
        String previousPath = referer != null ? referer.replaceFirst("^(http[s]?://[^/]+)", "") : null;
        LoginVO user = (LoginVO) session.getAttribute("user");


        // 로그인 유무
        if(user != null) {
            // 마이페이지 주문 조회에서 온경우
            if(previousPath != null && previousPath.equals("/my/inquiry")) {
                model.addAttribute("rawOrder", rawOrder);
                model.addAttribute("parsedOrder", parsedOrder);
                return "shop/order_info";
                // 마이페이지에서 상세 페이지로 이동하는 경우
            } else {
                return "redirect:/my/inquiry";
            }
        } else {
            // 주문 내역과 주문 번호가 있는 경우
            if (no != null && !no.isEmpty()) {
                model.addAttribute("parsedOrder", parsedOrder);
                model.addAttribute("rawOrder", rawOrder);
                return "shop/order_info";
                // 주문 내역 주문 번호가 없는 경우, 로그인에서 온 경우
            } else if(previousPath != null && previousPath.equals("/login")) {
                rttr.addFlashAttribute("msg", "주문 내역이 없거나 주문번호가 틀립니다.\n 주문번호는 숫자 16자리 입니다.");
                return "redirect:/login";
            } else {
                return "redirect:/login";
            }
        }
    }

    public void getWishList(Model model, HttpSession session) {
        LoginVO user = (LoginVO) session.getAttribute("user");
        if (user != null) {
            pagination.setSearchMap(Collections.singletonMap("id", user.getId()));
            List<ShopVO> list = shopService.selectWish(pagination);
            List<Integer> collect = list.stream().map(ShopVO::getNo).collect(Collectors.toList());

            model.addAttribute("wishList", collect);
        }
    }
}
