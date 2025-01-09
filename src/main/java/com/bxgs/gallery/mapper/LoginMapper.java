package com.bxgs.gallery.mapper;

import com.bxgs.gallery.model.CouponVO;
import com.bxgs.gallery.model.LoginVO;
import com.bxgs.gallery.model.PointVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;


@Mapper
public interface LoginMapper {
    // 로그인 시도
    LoginVO login(LoginVO loginVO);
    // 아이디 중복확인
    int idCheck(String id);
    // 아이디 찾기 시 메일 보내기
    int findMember(String email);
    // 회원가입
    void joinInsert(LoginVO loginVO);
    // 회원탈퇴
    int withdraw(LoginVO loginVO);
    // 회원수정
    int memberUpdate(LoginVO loginVO);
    // 쿠폰
    List<CouponVO> selectCoupon(String id, String isEnd);
    // 적립금
    List<PointVO> selectPoint(String id, String start, String end);
}
