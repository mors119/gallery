package com.bxgs.gallery.mapper;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.model.CartVO;
import com.bxgs.gallery.model.DataVO;
import com.bxgs.gallery.model.OrderVO;
import com.bxgs.gallery.model.ShopVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import javax.xml.crypto.Data;
import java.util.List;
import java.util.Map;

@Mapper
public interface ShopMapper {
    // 전체 조회
    List<ShopVO> selectAll(Pagination pagination);
    // 상세 조회
    ShopVO selectByGoods(int no);
    // 아티스트 다른 그림 랜덤 조회
    List<ShopVO> randomPicture(int no);
    // 글 개수
    int totalCount(Pagination pagination);
    // 찜리스트
    List<ShopVO> selectWish(Pagination pagination);
    // 찜 개수
    int totalCountWish(String id);
    // 찜 리스트 유무
    int selectIsWish(String id, int no);
    // 찜 리스트 insert
    int insertWish(String id, int no);
    // 찜 리스트 delete
    int deleteWish(String id, int...no);
    // 주문
    void insertOrder(OrderVO orderVO);
    // 상품후기 작성
    int reviewInsert(Map<String, String> dataVO);
    // 상품후기 수정
    int reviewUpdate(Map<String, String> dataVO);
    // 상품후기 삭제
    int reviewDelete(int no);
    // 상품후기 전체 조회
    List<ShopVO> selectAllReview(int no, String order);
    // 상품후기 총 개수
    int totalReview(int no);
    // 상품후기 상세
    Map<String, String> selectOneReview(int no);
    // 상품문의 총 개수
    int totalAsk(int no);
    // 상품문의 전체 조회
    List<ShopVO> selectAllAsk(int no);
    // 상품문의 상세 조회
    Map<String, String> selectByAsk(int no);
    // view 상품 문의 쓰기
    int askInsert(DataVO dataVO);
    // view 상품 문의 수정
    int askUpdate(DataVO dataVO);
    // 상품문의 삭제
    int askDelete(int no);
    // 주문번호로 조회
    Map<String, Object> orderOne(String no);
    // 나의 주문 전체 조회
    List<Map<String, Object>> myOrderAll(String id);
    // insert 상품 관련 정보
    void insertCart(CartVO cartVO);
}
