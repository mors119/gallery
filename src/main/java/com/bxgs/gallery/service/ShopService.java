package com.bxgs.gallery.service;

import com.bxgs.gallery.common.Pagination;
import com.bxgs.gallery.mapper.ShopMapper;
import com.bxgs.gallery.model.CartVO;
import com.bxgs.gallery.model.DataVO;
import com.bxgs.gallery.model.OrderVO;
import com.bxgs.gallery.model.ShopVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopMapper shopMapper;

    // 전체 조회
    public List<ShopVO> selectAll(Pagination pagination) {
        return shopMapper.selectAll(pagination);
    }

    // 상세 조회
    public ShopVO selectByGoods(int no) {
        return shopMapper.selectByGoods(no);
    }

    // 아티스트 다른 그림 랜덤 조회
    public List<ShopVO> randomPicture(int no) {
        return shopMapper.randomPicture(no);
    }

    // 글 개수
    public int totalCount(Pagination pagination) {
        return shopMapper.totalCount(pagination);
    }

    // 상품후기 작성
    public int reviewInsert(Map<String, String> dataVO) { return shopMapper.reviewInsert(dataVO); }

    // 상품후기 수정
    public int reviewUpdate(Map<String, String> dataVO) {
        return shopMapper.reviewUpdate(dataVO);
    }

    // 상품후기 삭제
    public int reviewDelete(int no) {
        return shopMapper.reviewDelete(no);
    }

    // 상품후기 전체조회
    public List<ShopVO> selectAllReview(int no, String order) {
        return shopMapper.selectAllReview(no, order);
    }

    // 상품후기 총 개수
    public int totalReview(int no) {
        return shopMapper.totalReview(no);
    }

    // 상품후기 상세
    public Map<String, String> selectOneReview(int no) {
        return shopMapper.selectOneReview(no);
    }

    // 상품문의 총 개수
    public int totalAsk(int no) {
        return shopMapper.totalAsk(no);
    }

    // 상품문의 전체 조회
    public List<ShopVO> selectAllAsk(int no) {
        return shopMapper.selectAllAsk(no);
    }

    // 상품문의 상세조회
    public Map<String, String> selectByAsk(int no) {
        return shopMapper.selectByAsk(no);
    }

    // 상품문의 삭제
    public int askDelete(int no) {
        return shopMapper.askDelete(no);
    }

    // Q&A insert
    public int askInsert(DataVO dataVO) {
        return shopMapper.askInsert(dataVO);
    }

    // Q&A update
    public int askUpdate(DataVO dataVO) {
        return shopMapper.askUpdate(dataVO);
    }

    // 찜리스트
    public List<ShopVO> selectWish(Pagination pagination) {
        if (pagination.getSearchMap() == null) return null;
        pagination.setTotalRecord(shopMapper.totalCountWish(pagination.getSearchMap().get("id")));
        return shopMapper.selectWish(pagination);
    }

    // 찜 리스트 유무
    public boolean selectIsWish(String id, int no) {
        return shopMapper.selectIsWish(id, no) > 0;
    }

    // 찜 리스트 insert
    public int insertWish(String id, int no) {
        return shopMapper.insertWish(id, no);
    }

    // 찜 리스트 delete
    public int deleteWish(String id, int...no) {
        return shopMapper.deleteWish(id, no);
    }

    // 주문
    public String insertOrder(OrderVO orderVO) {
        shopMapper.insertOrder(orderVO);
        return orderVO.getNo();
    }

    public Map<String, Object> orderOne(String no) {
        return shopMapper.orderOne(no);
    }

    public List<Map<String, Object>> myOrderAll(String id) {
        return shopMapper.myOrderAll(id);
    }

    // 주문 시 로컬스토리지 goods 값을 cart 테이블에 insert
    public List<Integer> insertCart(List<CartVO> cartVO) {
        List<Integer> list = new ArrayList<>();
        for(CartVO cart : cartVO) {
            shopMapper.insertCart(cart);
            list.add(cart.getNo());
        }
        return list;
    }

}
