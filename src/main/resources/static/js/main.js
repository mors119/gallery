window.addEventListener('DOMContentLoaded', function () {
    // 메인 페이지네이션
    let bullet1 = ['01', '02', '03'];
    let bullet2 = [
        'BAEXANG GALLERY SHOP <br> GRAND OPEN',
        'GRAND OPEN',
        'BAEXANG',
    ];

    window.addEventListener('resize', function() {
        mainSlider.update();
        bestSlider.update();
        piSlider.update();
        ptSlider.update();
        newSlider.update();
        reviewSlider.update();
    });

    const mainSlider = new Swiper('.main_container .main_slider .swiper', {
        simulateTouch: true,
        loop: true,
        speed: 1000,
        roundLengths: true,
        lazy: {
            loadPrevNext: true,
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return (
                    `<div class="${className}">
                        <span>${bullet1[index]}</span>
                        <p>${bullet2[index]}</p>
                    </div>`
                );
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function () {
                document
                    .querySelectorAll('.main_slider .slide_txt')[0]
                    .classList.add('on');
            },
            slideChangeTransitionStart: function () {
                let idx = this.realIndex;
                const slideTxt = document.querySelectorAll('.main_slider .slide_txt');

                slideTxt.forEach((v) => v.classList.remove('on'));
                slideTxt[idx].classList.add('on');
            },
        },
    });

    // Next 버튼에 GSAP 애니메이션 적용
    const moveButtons = document.querySelectorAll('.main_slider [class^="swiper-button-"]');
    if (moveButtons) {
        moveButtons.forEach(btn => {
            const spanElement = btn.querySelector('span');
            btn.addEventListener('mouseenter', function () {
                setSpanStyles('1', 'visible', '100px', '100px', '95px', 'white');
            });
            btn.addEventListener('mouseleave', function () {
                setSpanStyles('0', 'hidden', '0', '0', '0', 'rgba(255, 255, 255, 0)');
            });

            function setSpanStyles(opacity, visibility, width, height, lineHeight, color) {
                spanElement.style.opacity = opacity;
                spanElement.style.visibility = visibility;
                spanElement.style.width = width;
                spanElement.style.height = height;
                spanElement.style.lineHeight = lineHeight;
                spanElement.style.color = color;
                spanElement.style.transition = 'width .3s, height .3s, opacity .4s, visibility .4s';
            }

            // 마우스 이동 이벤트 리스너
            btn.addEventListener('mousemove', (event) => {
                const rect = btn.getBoundingClientRect();
                const x = event.clientX - rect.left; // 버튼 내에서의 X 좌표
                const y = event.clientY - rect.top; // 버튼 내에서의 Y 좌표

                // GSAP를 사용하여 span 요소의 위치 애니메이션
                gsap.to(spanElement, {
                    duration: 0.2,
                    x: x,
                    y: y,
                });
            });
        });
    }

    // 베스트 페이지
    const bestSlider = new Swiper('.main_container .main_best .swiper', {
        simulateTouch: true,
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 30,
        speed: 1300,
        roundLengths: true,
        lazy: {
            loadPrevNext: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 추천 페이지 tab
    const pickBtn = document.querySelectorAll('.main_container .pick_tab li');
    if (pickBtn) {
        pickBtn.forEach((pick, idx) => {
            pick.addEventListener('click', function (e) {
                e.preventDefault();
                pickBtn.forEach(v => v.classList.remove('on'));
                this.classList.add('on');

                const pickGnb = document.querySelectorAll('.pick_gnb');
                pickGnb.forEach(v => v.classList.remove('on'));
                pickGnb[idx].classList.add('on');
            });
        });
    }

    // 추천 페이지 슬라이드
    const piSlider = new Swiper('.main_container .main_pick .swiper-img', {
        simulateTouch: true,
        loop: false,
        slidesPerView: 1,
        roundLengths: true,
        lazy: {
            loadPrevNext: true,
        },
    });

    const ptSlider = new Swiper('.main_container .main_pick .swiper-txt', {
        simulateTouch: true,
        loop: false,
        speed: 0,
        slidesPerView: 1,
        roundLengths: true,
        lazy: {
            loadPrevNext: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        controller: {
            control: piSlider
        },
    });

    // 신작 페이지
    const newSlider = new Swiper('.main_container .main_new .swiper', {
        simulateTouch: true,
        loop: false,
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 30,
        roundLengths: true,
        lazy: {
            loadPrevNext: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 후기 페이지
    const reviewSlider = new Swiper('.main_container .main_review .swiper', {
        simulateTouch: true,
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 30,
        roundLengths: true,
        lazy: {
            loadPrevNext: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});
