package com.bxgs.gallery.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SupportController {

    @GetMapping("support")
    public String page() {
        return "support/write";
    }
}
