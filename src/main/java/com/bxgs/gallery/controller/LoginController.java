package com.bxgs.gallery.controller;

import com.bxgs.gallery.model.LoginVO;
import com.bxgs.gallery.service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;
import java.net.URISyntaxException;


// controller => service => Mapper => mappers(.xml)

@Controller
@RequiredArgsConstructor
public class LoginController {
    private final LoginService loginService;
    // @RequiredArgsConstructor 대신 사용하려면,
//    private LoginService loginService;
//    @Autowired
//    public LoginController(LoginService loginService) {
//        this.loginService = loginService;
//    }

    // 로그인 페이지 이동
    @GetMapping("/login")
    public String login(String user, WebRequest webRequest, Model model) {
        String referer = webRequest.getHeader("referer");
        String previousPath = referer != null ? referer.replaceFirst("^(http[s]?://[^/]+)", "") : null;
        // 이전 페이지가 cart면 1리턴
        if (previousPath != null && previousPath.equals("/shop/cart")) {
            model.addAttribute("referer", 1);
        } else if(previousPath != null && previousPath.equals("/shop/order_info")) {
            model.addAttribute("referer", 2);
        }
        return "login/login";
    }

    // 회원가입 전 페이지
    @GetMapping("/join_intro")
    public String join_intro() {
        return "login/join_intro";
    }

    // 약관 동의 페이지
    @GetMapping("/join_tos")
    public String join_tos() {
        return "login/join_tos";
    }

    // 회원가입 페이지
    @GetMapping("/join")
    public String join() {
        return "login/join";
    }

    // 회원가입 완료 알림 페이지
    @GetMapping("/join_result")
    public String join_result(String name, Model model) {
        model.addAttribute("name", name);
        return "login/join_result";
    }

    // 로그인 시도(&회원정보 세션에 담기)
    @PostMapping("/postLogin")
    public String postLogin(String id, String pw, HttpSession session, RedirectAttributes rttr) {
        // 로그인 체크
        LoginVO result = loginService.login(id, pw);
        if (result != null) {
            // 세션을 생성하기 전에 기존의 세션 파기
            session.setAttribute("user", result);
            session.setMaxInactiveInterval(1800); // Session 30분동안 유지
            return "redirect:/";
        }

        rttr.addFlashAttribute("msg", "가입된 회원아이디가 아니거나 비밀번호가 틀립니다.\n 비밀번호는 대소문자를 구분합니다.");
        return "redirect:/login";
    }

    // 로그아웃
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        if (session != null) session.invalidate();

        return "redirect:/";
    }

}
