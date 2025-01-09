//package com.bxgs.gallery.security;
//
//
//import org.apache.catalina.filters.HttpHeaderSecurityFilter;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
//import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
//
//@Configuration // 스프링 설정 파일
//@EnableWebSecurity // 모든 요청을 스프링 시큐리티가 제어
//public class SecurityConfig  {
//
//    // URL에 filterChain 필터 적용
//    @Bean
//    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http.authorizeHttpRequests(authorizeRequests -> authorizeRequests
//                        // 페이지 설정 (/** 모든 요청을 허용)
//                        .requestMatchers(new AntPathRequestMatcher("/**")).permitAll())
//                .csrf((csrf) -> csrf
//                        // 토큰 예외처리
//                        .ignoringRequestMatchers(new AntPathRequestMatcher("/h2-console/**")))
//                .headers((headers) -> headers
//                        // 동일 사이트에서 제공 시에만 허가 (클릭재킹 공격을 막기 위해 사용)
//                        .addHeaderWriter(new XFrameOptionsHeaderWriter(
//                                XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)))
//                        // formLogin은 로그인 설정을 담당
//                .formLogin((formLogin) -> formLogin
//                        .loginPage("/login") // login page URL
//                        .defaultSuccessUrl("/postLogin")) //성공 시 이동
//                .logout(logout -> logout
//                        .logoutUrl("/logout")
//                        .logoutSuccessUrl("/"))
//        ;
//
//        return http.build();
//    }
//
//    // 패스워드 해석 후 다시 리턴
//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//}
