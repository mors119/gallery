document.addEventListener('DOMContentLoaded', function () {
    // 필터 리스트 작동
    const searchFt = document.querySelectorAll('.search_container .sort_list_wrap > li > a');
    if (searchFt) {
        searchFt.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                // 부모인 'li'
                const searchA = this.closest('li');
                searchA.classList.toggle('on');
                // 다른 요소 on 지우기
                searchFt.forEach((i) => {
                    const searchLi = i.closest('li')
                    // 현재요소와 다른 요소만 제거
                    if (searchLi !== searchA) searchLi.classList.remove('on')
                });
            });
        })
    }

    // 체크박스 작동
    const tabBox = document.querySelectorAll('.search_container .tab_box');
    if (tabBox) {
        tabBox.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                tabBox.forEach((i) => {
                    if (i !== item) i.classList.remove('on')
                });
                item.classList.toggle('on');
            });
        });

        // 다른 곳 클릭 시 off
        document.addEventListener('click', function (e) {
            tabBox.forEach((item) => {
                if (!item.contains(e.target)) {
                    item.classList.remove('on');
                }
            });
        });
    }

    // 체크박스 li 상단고정
    const tabBoxDepth = document.querySelectorAll('.search_container .tab_box li');
    if (tabBoxDepth) {
        tabBoxDepth.forEach(depth => {
            depth.addEventListener('click', function (e) {
                e.preventDefault();
                // 부모인 'a'에 적용
                this.closest('.tab_box').querySelector('a').innerText = this.innerText;
            });
        });
    }

    // 9개씩보기 / 12개씩 보기 ,,, 인기순 / 후기순 / 평점순 ...
    const showSearchListSize = document.querySelectorAll('.search_container .tab_box ul li');
    if (showSearchListSize) {
        showSearchListSize.forEach(size => {
            size.addEventListener('click', function () {
                const _size = this.dataset.size;
                let _search = location.search;

                if (_size) {
                    _search = _search.replace(/([&?])size=[^&]*(&|$)/, '$1').replace(/&$/, '').replace(/\?$/, '');

                    if (location.search) location.href = _search + `&size=${_size}#searchWordWrap`
                    else location.href = `/search?size=${_size}#searchWordWrap`;
                }

                const _sort = this.dataset.sort;
                if (_sort) {
                    _search = _search.replace(/([&?])sort=[^&]*(&|$)/, '$1').replace(/&$/, '').replace(/\?$/, '');

                    if (location.search) location.href = _search + `&sort=${_sort}#searchWordWrap`
                    else location.href = `/search?sort=${_sort}#searchWordWrap`;
                }
            });
        });
    }
})