document.addEventListener('DOMContentLoaded', function () {
    // sale_wrap에 값이 있으면 정가 출력
    const salePrice = document.querySelector('.painting_list .swiper-text .txt .price .sale_wrap');
    if (salePrice) {
        const price = salePrice.textContent;
        if (price > 0) {
            salePrice.innerHTML = `<span class="sale"><strong>${price}</strong>원</span>`;
        }
    }

    const imagesLength = document.querySelectorAll('.painting_list .swiper-images .swiper-slide');
    const imageSwiper = new Swiper('.painting_list .swiper-images', {
        effect: 'creative',
        loop: true,
        speed: 1000,
        creativeEffect: {
            prev: {
                translate: [-50, 0, -200],
                rotate: [0, 100, 0],
                opacity: 0.3,
                scale: 0.8,
                origin: 'left center',
            },
            next: {
                translate: [50, 0, -200],
                rotate: [0, -100, 0],
                opacity: 0.3,
                scale: 0.8,
                origin: 'right center',
            },
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    const textSwiper = new Swiper('.painting_list .swiper-text', {
        loop: true,
        speed: 0, // 이동 효과 끄기
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        simulateTouch: false,  // 드래그 금지
        slideToClickedSlide: true,  // 클릭 시 해당 슬라이드로 이동
    });

    if (imagesLength) {
        imageSwiper.controller.control = textSwiper;
        textSwiper.controller.control = imageSwiper;

        // 최초 엑티브 값 맞추기 값 0으로 설정
        // if (imageSwiper.activeIndex === 0) {
        //     textSwiper.slideTo(0);
        // }
        // 슬라이드 체인지 시 값 맞추기
        // let idx = 0;
        // imageSwiper.on('slideChange', function () {
        //     idx = parseInt(imageSwiper.realIndex) - 1;
        //     if (idx === -1) {
        //         idx = imagesLength.length - 1;
        //         textSwiper.slideTo(idx);
        //         textSwiper.update();
        //         return;
        //     }
        //     textSwiper.slideTo(idx);
        //     textSwiper.update();
        // });

        // 하단 페이지네이션 가운데 정렬
        const pagination = document.querySelector('.painting_list .swiper-pagination');
        const pageCnt = pagination.children.length;
        if (pageCnt > 1) {
            pagination.style.marginLeft = (30 + 14 * pageCnt) + 'px';
        }
    }

    // *** 정렬/보기 선택을 위한 toggle('on')
    const sortAndView = document.querySelectorAll('.painting_list .art_content .select_wrap div');
    if (sortAndView) {
        sortAndView.forEach((item) => {
            item.addEventListener('click', function () {
                item.classList.toggle('on');
            });
        });

        // 정렬 순서 변경
        const sortLi = document.querySelectorAll('.painting_list .art_content .sort li');
        sortLi.forEach(item => {
            item.addEventListener('click', () => {
                let span = item.closest('div').children[0];
                span.innerText = item.innerText;

                let _search = location.search;
                const sortWord = item.dataset.sort;
                if (sortWord) {
                    _search = _search.replace(/([&?])sort=[^&]*(&|$)/, '$1').replace(/&$/, '').replace(/\?$/, '');

                    if (_search.indexOf("?") !== -1) location.href = location.pathname + _search + `&sort=${sortWord}#artContent`
                    else location.href = `${location.pathname}?sort=${sortWord}#artContent`;
                }
            });
        });

        // X개씩 보기 클릭 시 변경 
        const viewLi = document.querySelectorAll('.painting_list .art_content .view li');
        viewLi.forEach(item => {
            item.addEventListener('click', () => {
                let span = item.closest('div').children[0];
                span.innerText = item.innerText;

                const cnt = item.dataset.cnt;
                if (cnt) {
                    const pathName = location.pathname;
                    let search = location.search;
                    if (search.indexOf("?cnt=") !== -1) search = search.substring(0, search.indexOf("?cnt="));
                    if (search.indexOf("&cnt=") !== -1) search = search.substring(0, search.indexOf("&cnt="));

                    if (search) {
                        location.href = pathName + search + '&cnt=' + cnt + '#artContent';
                    } else {
                        location.href = pathName + '?cnt=' + cnt + '#artContent';
                    }
                }
            });
        });

        // 다른 곳 클릭 시 off
        document.addEventListener('click', function (e) {
            sortAndView.forEach((item) => {
                if (!item.contains(e.target)) {
                    item.classList.remove('on');
                }
            });
        });
    }

});
