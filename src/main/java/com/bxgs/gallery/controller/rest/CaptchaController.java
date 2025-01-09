package com.bxgs.gallery.controller.rest;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CaptchaController {

    @PostMapping("/verify-captcha")
    public ResponseEntity<String> verifyCaptcha(@RequestParam("g-recaptcha-response") String captchaResponse) {
        String secretKey = "6LdYq5gqAAAAAKplleyf5rruvCz4lmakG79twzYm";
        String url = "https://www.google.com/recaptcha/api/siteverify";

        RestTemplate restTemplate = new RestTemplate();

        // 요청 데이터 생성
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("secret", secretKey);
        requestBody.put("response", captchaResponse);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
        Boolean success = (Boolean) response.getBody().get("success");

        if (success) {
            return ResponseEntity.ok("CAPTCHA 검증 성공!");
        } else {
            return ResponseEntity.badRequest().body("CAPTCHA 검증 실패!");
        }
    }
}
