package com.bxgs.gallery.common;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;

import java.util.Map;

@Data
public class Pagination {
    // 기본값
    private int pageSize = 10; 		// 한 페이지에 보일 게시물 사이즈
    private int pageNavSize = 2; 	// 페이지 보여줄 단위(사이즈)
    private int pageNum = 1; 		// 현재시작 페이지(current)

    // 계산되어질 값
    private int totalPage; 			// 총 페이지 갯수
    private long totalRecord; 		// 총 게시물(레코드) 갯수
    private int startPage; 			// 페이지의 시작번호
    private int endPage; 			// 페이지의 마지막번호
    private int prevPage;			// 이전페이지(블록)
    private int nextPage;			// 다음페이지(블록)

    // 버튼 노출여부
    private boolean hasPrevPage; 	// 이전페이지
    private boolean hasNextPage; 	// 다음페이지
    private boolean hasFirstPage; 	// 맨 첫번째 페이지
    private boolean hasLastPage; 	// 맨 마지막 페이지

    // 검색
    private Map<String, String> searchMap; 	// 검색
    private String orderName = "NO";		// 차순명 지정
    private String order = "DESC";	        // 오름차순 / 내림차순

    // DB 시작/끝 지정
    private int start;				// 시작번호
    private int end;				// 끝번호

    public Pagination() {}

    public Pagination(int pageNum, long totalRecord) {
        if (pageNum < 1) pageNum = 1;

        this.pageNum = pageNum;
        this.totalRecord = totalRecord;

        calculation();
    }

    // 계산로직
    public void calculation() {
        totalPage = (int) Math.ceil(totalRecord / (double) pageSize);

        // view
        startPage = (pageNum - 1) / pageNavSize * pageNavSize + 1;
        endPage = startPage + pageNavSize - 1;

        if (endPage > totalPage) endPage = totalPage;

        hasPrevPage = startPage != 1;
        hasNextPage = ((long) endPage * pageSize) < totalRecord;

        prevPage = (pageNum - 1) / pageNavSize * pageNavSize;
        nextPage = prevPage + pageNavSize + 1;

        hasFirstPage = (pageNum > 1 && pageNavSize < pageNum);
        hasLastPage = (pageNum < totalPage && endPage + 1 < totalPage);

        // db
        start = (pageNum - 1) * pageSize + 1;
        end = Math.min(pageNum * pageSize, (int) totalRecord);
    }

    public void setTotalRecord(long totalRecord) {
        this.totalRecord = totalRecord;
        calculation();
    }

    // 페이징
    public String paging(HttpServletRequest request) {
        StringBuilder sb = new StringBuilder();

        sb.append("<div class=\"pagination\">");

        // 첫페이지
//        if (hasFirstPage) {
//            sb.append("<a class='page_num page_first' href='");
//            sb.append(request.getRequestURI());
//            sb.append("?pageNum=1");
//
//            appendPageLink(sb);
//
//            sb.append("'>");
//            sb.append("&lt;&lt;");
//            sb.append("</a>");
//        }

        // 이전페이지
        if (hasPrevPage) {
            sb.append("<a class='page_num page_prev' href='");
            sb.append(request.getRequestURI());
            sb.append("?pageNum=");
            sb.append(prevPage);

            appendPageLink(sb);

            sb.append("'>");
            sb.append("&lt;");
            sb.append("</a>");
        }

        // 현재페이지 블록
        for (int i = startPage; i <= endPage; i++) {
            if (pageNum == i) {
                sb.append("<span class='page_num active'>");
                sb.append(i);
                sb.append("</span>");
            } else {
                sb.append("<a class='page_num' href='");
                sb.append(request.getRequestURI());
                sb.append("?pageNum=");
                sb.append(i);

                appendPageLink(sb);

                sb.append("'>");
                sb.append(i);
                sb.append("</a>");
            }
        }

        // 다음페이지
        if (hasNextPage) {
            sb.append("<a class='page_num page_next' href='");
            sb.append(request.getRequestURI());
            sb.append("?pageNum=");
            sb.append(nextPage);

            appendPageLink(sb);

            sb.append("'>");
            sb.append("&gt;");
            sb.append("</a>");
        }

        // 끝 페이지
//        if (hasLastPage) {
//            sb.append("<a class='page_num page_last' href='");
//            sb.append(request.getRequestURI());
//            sb.append("?pageNum=");
//            sb.append(totalPage);
//
//            appendPageLink(sb);
//
//            sb.append("'>");
//            sb.append("&gt;&gt;");
//            sb.append("</a>");
//        }

        sb.append("</div>");

        return sb.toString();
    }

    // 페이징(view) 공통 처리
    private void appendPageLink(StringBuilder sb) {
        // 검색
        if (searchMap != null && !searchMap.isEmpty()) {
            for (Map.Entry<String, String> entry : searchMap.entrySet()) {
                sb.append("&");
                sb.append(entry.getKey());
                sb.append("=");
                sb.append(entry.getValue());
            }
        }
    }
}
