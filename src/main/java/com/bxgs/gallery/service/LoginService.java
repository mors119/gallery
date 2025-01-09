package com.bxgs.gallery.service;

import com.bxgs.gallery.mapper.LoginMapper;
import com.bxgs.gallery.model.CouponVO;
import com.bxgs.gallery.model.LoginVO;
import com.bxgs.gallery.model.PointVO;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class LoginService {
    private final LoginMapper loginMapper;
//    private final PasswordEncoder passwordEncoder;
    
    // 로그인 시도
    public LoginVO login(String id, String pw) {
        LoginVO loginVO = new LoginVO();
        loginVO.setId(id);
//        loginVO.setPw(passwordEncoder.encode(pw));
        loginVO.setPw(pw);
        return loginMapper.login(loginVO);
    }

    // 아이디 중복체크
    public int idCheck(String id) {
        return loginMapper.idCheck(id);
    }

    // 회원가입
    public void joinInsert(LoginVO loginVO) {
        // security 적용 시 패스워드 엔코딩
//        loginVO.setPw(passwordEncoder.encode(loginVO.getPw()));
        loginMapper.joinInsert(loginVO);
    }

    // 아이디/비밀번호 찾기
    public int findMember(String email) {
        return loginMapper.findMember(email);
    }

    // 회원탈퇴
    public int withdraw(LoginVO loginVO) {
        return loginMapper.withdraw(loginVO);
    }

    // 회원수정
    public int memberUpdate(LoginVO loginVO) {
        return loginMapper.memberUpdate(loginVO);
    }

    // 쿠폰
    public List<CouponVO> selectCoupon(String id, String isEnd) {
        return loginMapper.selectCoupon(id, isEnd);
    }

    // 적립금
    public List<PointVO> selectPoint(String id, String start, String end) {
        return loginMapper.selectPoint(id, start, end);
    }

}
