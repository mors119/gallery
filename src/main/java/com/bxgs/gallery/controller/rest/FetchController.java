package com.bxgs.gallery.controller.rest;

import com.bxgs.gallery.model.*;
import com.bxgs.gallery.service.LoginService;
import com.bxgs.gallery.service.ShopService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rest")
@RequiredArgsConstructor
public class FetchController {
    private final LoginService loginService;
    private final ShopService shopService;


    // join 아이디 체크
    @GetMapping("/idCheck/{id}")
    public ResponseEntity<Integer> idCheck(@PathVariable String id) {
        int idCheck = loginService.idCheck(id);
        if (idCheck == 1) {
            // ID가 이미 사용 중
            return ResponseEntity.ok(1);
        }
        // 사용 가능한 ID
        return ResponseEntity.ok(0); // 200 OK
    }

    // 회원가입
    @PostMapping("/joinInsert")
    public ResponseEntity<Map<String, String>> joinInsert(@RequestBody LoginVO loginVO) {
        loginService.joinInsert(loginVO);
        Map<String, String> response = new HashMap<>();
        response.put("status", HttpStatus.OK.getReasonPhrase());
        response.put("message", "회원 가입을 축하합니다.");

        return ResponseEntity.ok(response);
    }

    // 아이디/비밀번호 찾기
    @GetMapping("/findMember/{email}")
    public ResponseEntity<Integer> findMember(@PathVariable String email) {
        int find = loginService.findMember(email);
        if (find == 1) {
            return ResponseEntity.ok(1);
        }
        return ResponseEntity.ok(0);
    }

    @GetMapping("/like/{no}")
    public ResponseEntity<Map<String, String>> like(@PathVariable int no, HttpSession session) {
        LoginVO user = (LoginVO) session.getAttribute("user");

        Map<String, String> response = new HashMap<>();

        if (user == null) {
            response.put("status", HttpStatus.UNAUTHORIZED.getReasonPhrase());
            response.put("message", "회원 전용 서비스 입니다.");
            return ResponseEntity.ok(response);
        }

        int result = 0;

        boolean isWish = shopService.selectIsWish(user.getId(), no);
        if (isWish) {
//            result = shopService.deleteWish(user.getId(), no);
            response.put("message", "찜리스트에 이미 등록된 상품입니다.");
        } else {
            result = shopService.insertWish(user.getId(), no);
            response.put("message", "상품을 찜리스트에 담았습니다.");
        }

        response.put("status", HttpStatus.OK.getReasonPhrase());
        response.put("result", String.valueOf(result));

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/withdrawal")
    public ResponseEntity<Integer> withdrawal(@RequestBody LoginVO loginVO) {
        int result = loginService.withdraw(loginVO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/memberUpdate")
    public ResponseEntity<Map<String, String>> memberUpdate(@RequestBody LoginVO loginVO) {
        loginService.memberUpdate(loginVO);
        Map<String, String> response = new HashMap<>();
        response.put("status", HttpStatus.OK.getReasonPhrase());
        response.put("message", "회원정보가 수정 되었습니다.");

        return ResponseEntity.ok(response);
    }


    @PostMapping("/reviewInsert")
    public ResponseEntity<Map<String, String>> reviewInsert(@RequestBody Map<String, String> datavo) {
        Map<String, String> response = new HashMap<>();
        if ("0".equals(datavo.get("rating"))) {
            datavo.put("rating", "1");
        }

        int result = shopService.reviewInsert(datavo);
        if (result > 0) {
            response.put("status", HttpStatus.OK.getReasonPhrase());
            response.put("message", "상품후기가 등록되었습니다.");
        } else {
            response.put("status", "Fail");
            response.put("message", "작성에 실패하였습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reviewUpdate")
    public ResponseEntity<Map<String, String>> reviewUpdate(@RequestBody Map<String, String> datavo) {
        Map<String, String> response = new HashMap<>();

        int result = shopService.reviewUpdate(datavo);
        if (result > 0) {
            response.put("status", HttpStatus.OK.getReasonPhrase());
            response.put("message", "상품후기가 수정되었습니다.");
        } else {
            response.put("status", "Fail");
            response.put("message", "수정에 실패하였습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reviewDelete/{no}")
    public ResponseEntity<Map<String, String>> reviewDelete(@PathVariable int no) {
        Map<String, String> response = new HashMap<>();
        int result = shopService.reviewDelete(no);
        if (result > 0) {
            response.put("status", HttpStatus.OK.getReasonPhrase());
            response.put("message", "상품후기가 삭제되었습니다.");
        } else {
            response.put("status", "Fail");
            response.put("message", "삭제에 실패하였습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/askInsert")
    public ResponseEntity<Map<String, String>> askInsert(@RequestBody DataVO datavo) {
        Map<String, String> response = new HashMap<>();

        int result = shopService.askInsert(datavo);

        if (result > 0) {
            response.put("status", HttpStatus.OK.getReasonPhrase());
            response.put("message", "상품문의가 등록되었습니다.");
        } else {
            response.put("status", "Fail");
            response.put("message", "작성에 실패하였습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/askUpdate")
    public ResponseEntity<Map<String, String>> askUpdate(@RequestBody DataVO datavo) {
        Map<String, String> response = new HashMap<>();

        int result = shopService.askUpdate(datavo);

        if (result > 0) {
            response.put("status", HttpStatus.OK.getReasonPhrase());
            response.put("message", "상품문의가 수정되었습니다.");
        } else {
            response.put("status", "Fail");
            response.put("message", "수정에 실패하였습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/askDelete/{no}")
    public ResponseEntity<Map<String, String>> askDelete(@PathVariable int no) {
        Map<String, String> response = new HashMap<>();

        int result = shopService.askDelete(no);

        if (result > 0) {
            response.put("status", HttpStatus.OK.getReasonPhrase());
            response.put("message", "상품문의를 삭제하였습니다.");
        } else {
            response.put("status", "Fail");
            response.put("message", "삭제에 실패하였습니다.\n잠시후 다시 시도하거나,\n관리자에게 문의하십시오.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/order_cart")
    public ResponseEntity<List<Integer>> insertCart(@RequestBody List<CartVO> cartVO) {
//        System.out.println("cartVO = " + cartVO);
        List<Integer> noList = shopService.insertCart(cartVO);
        return ResponseEntity.ok(noList);
    }
}
