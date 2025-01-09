window.addEventListener('DOMContentLoaded', function () {
    const optOpen1 = document.getElementById('opt1');
    if (optOpen1) {
        optOpen1.addEventListener('click', function () {
            this.classList.toggle('open');
        });
    }

    // bg_prev_list 클릭 시 on 클래스 처리, 해당 요소외에 on 클래스 지우기
    const bgThumbs = document.querySelectorAll('.bg_thumb');
    if (bgThumbs) {
        bgThumbs.forEach((item) => {
            item.addEventListener('click', function () {
                bgThumbs.forEach((i) => i.classList.remove('on'));
                item.classList.add('on');

                // 프레임 배경 이미지 변경 (미리보기)
                const _src = item.querySelector('img').getAttribute('src');
                const frameBg = document.querySelector('#order_wrap .order_bg_prev');
                frameBg.style.backgroundImage = `url(${_src})`;
            });
        });
    }

    // sns 공유하기 버튼 클릭 시 팝업 열림
    const shareBtn = document.querySelector('.share_sns_btn');
    const snsArea = document.querySelector('.sns_area');
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            snsArea.style.display = 'block';
        });
    }

    // sns 공유하기 팝업 x버튼 클릭 시 닫힘
    const snsCloseBtn = document.querySelector('.sns_area .close_btn');
    if (snsCloseBtn) {
        snsCloseBtn.addEventListener('click', function () {
            snsArea.style.display = 'none';
        });
    }

    // sns 공유하기 URL 복사
    const snsLinkInput = document.querySelector('.sns_link_copy input[type=text]');
    const snsLinkCopy = document.querySelector('.sns_link_copy button');
    if (snsLinkCopy) {
        snsLinkCopy.addEventListener('click', function () {
            const copyUrl = snsLinkInput.value;
            // 주소 값 복사
            window.navigator.clipboard.writeText(copyUrl).then(() => {
                alert('URL이 복사 되었습니다.');
            });
        });
    }

    // 찜하기 버튼 로그인 상태가 아닐 시
    const wishBtn = document.querySelector('.share_sns a');
    if (wishBtn) {
        wishBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fetch(`/rest/like/${this.dataset.no}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status) {
                        if (data.result === '1') this.classList.toggle('on');
                        alert(data.message);
                    }
                });
        });
    }

    // #option_scroll 미디어 선택 시 프레임 변경
    const mediaSelect = document.querySelectorAll('#option_scroll .media_select input');
    const _fopt1 = document.getElementById('fopt1');
    const _fopt2 = document.getElementById('fopt2');
    if (mediaSelect) {
        mediaSelect.forEach((item) => {
            item.addEventListener('click', function () {
                // value 값이 2일 때 ul의 자식 중 input[type="radio"]에 checked 걸기
                if (item.value === '2') {
                    _fopt1.style.display = 'none';
                    _fopt2.style.display = 'flex';
                    _fopt2.firstElementChild.querySelector('input[type="radio"]').checked = true;
                    retouchSelect1.checked = true;
                    // value 값이 1일 때 ul의 자식 중 input[type="radio"]에 checked 걸기
                } else {
                    _fopt1.style.display = 'flex';
                    _fopt2.style.display = 'none';
                    _fopt1.firstElementChild.querySelector('input[type="radio"]').checked = true;
                }
            });
        });
    }

    const retouchSelect1 = document.getElementById('retouch_select1');
    const retouchInput = document.querySelectorAll('.retouch input');
    if (retouchInput) {
        retouchInput.forEach((rtI) => {
            rtI.addEventListener('click', function () {
                const mopt2 = document.getElementById('mopt2').checked;
                if (rtI.value === '2' && mopt2) {
                    alert('캔버스인 경우에만 선택 가능합니다.')
                    retouchSelect1.checked = true;
                }
            })
        })
    }

    // 미디어 캔버스, 프레임 선택 시 앤틱D실버, 원목베이지 일 때만 매트(여백)선택 선택지 추가
    const matType = document.querySelectorAll('#matopt1 li');
    const _foptRadio = document.querySelectorAll('.fopt_wrap input[type=radio]');
    if (_foptRadio) {
        _foptRadio.forEach((foptRadio) => {
            foptRadio.addEventListener('click', function () {
                matType.forEach((item) => {
                    // foptRadio 값이 6이나 7일 때 
                    if (foptRadio.value === '6' || foptRadio.value === '7') {
                        item.style.display = 'list-item';
                        // 그 외
                    } else {
                        item.style.display = 'none';
                        matType[0].style.display = 'list-item';
                    }
                });
            });
        });
    }

    // 상품 수량 버튼
    const plusBtn = document.querySelector('#qty_area .qty_plus');
    const minusBtn = document.querySelector('#qty_area .qty_minus');
    const qtyValue = document.getElementById('opt_qty');
    // 수량 플러스 버튼
    let _num = 1;
    if (plusBtn) {
        plusBtn.addEventListener('click', function () {
            _num++;
            qtyValue.value = _num;
        });
        // 수량 마이너스 버튼
        minusBtn.addEventListener('click', function (e) {
            if (qtyValue.value > 1) {
                _num--;
                qtyValue.value = _num;
            } else {
                alert('최소 구매 수량은 1입니다.');
            }
        });
    }

    // 장바구니 버튼
    const cartBtn = document.querySelectorAll('#order_area a');
    // 그림 사이즈 select
    const sizeSelect = document.getElementById('opt1');
    if (cartBtn) {
        cartBtn.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (!sizeSelect.value.length) {
                    alert('사이즈를 선택해주세요.');
                }
            });
        });
    }

    // 슬라이더
    let goodsSlider = new Swiper('#recommend_pic .swiper', {
        slidesPerView: 4, // 한 슬라이드에 보여줄 갯수
        autoplay: false, // 자동 슬라이드 설정 , 비 활성화 시 false
        speed: 1000,
        spaceBetween: 30,
        observer: true,
        observeParents: true,
        navigation: {
            // 버튼 사용자 지정
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 'item_grade'의 그래프 var 값이 0.0% 보다 클 때 li에 on 클래스 걸어서 색 변경
    const gradeItems = document.querySelectorAll('.grade_item');
    if (gradeItems) {
        gradeItems.forEach((item) => {
            // 모든 'percent' div의 텍스트를 가져와 숫자(실수)로 변환
            const percentText = item.querySelector('.percent').textContent.trim();
            const percentValue = parseFloat(percentText.replace('%', ''));

            // percent 값이 0보다 클 경우 'on' class 추가
            if (percentValue > 0) {
                item.classList.add('on');
            }
        })
    }

    // review_info 클릭 시 on 토글
    const reviewInfo = document.querySelectorAll('.review_content .review_info');
    if (reviewInfo) {
        reviewInfo.forEach((item) => {
            item.addEventListener('click', function () {
                item.classList.toggle('on');

                // qaDepthWrap 엘리먼트 높이가 500px 이 넘는 경우에만 스크롤 달기
                const reviewDepth = item.closest('li').querySelector('.review_depth');
                reviewDepth.style.overflowY = reviewDepth.scrollHeight > 500 ? 'auto' : 'hidden';
            });
        });
    }

    // qa_info 클릭 시 on 토글
    const qaInfo = document.querySelectorAll('.qa_content .qa_info');
    if (qaInfo) {
        qaInfo.forEach((item) => {
            item.addEventListener('click', function () {
                const qaDepthWrap = item.closest('li').querySelector('.qa_depth_wrap');
                if (qaDepthWrap.dataset.chk === 'false') {
                    alert('비밀글은 작성자만 확인이 가능합니다.');
                    return false;
                }

                item.classList.toggle('on');

                // qaDepthWrap 엘리먼트 높이가 500px 이 넘는 경우에만 스크롤 달기
                qaDepthWrap.style.overflowY = qaDepthWrap.scrollHeight > 500 ? 'auto' : 'hidden';
            });
        });
    }

    // 리뷰 사용후기 쓰기 클릭 시 알림창
    const goodsWriteBtn = document.querySelector('#user_review .box_action a');
    if (goodsWriteBtn) {
        const url = goodsWriteBtn.getAttribute('href');
        const name = 'review_write';
        const option = 'width=793, height=745';

        goodsWriteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const isLogin = this.closest('.right').dataset.islogin;
            if (isLogin === 'true') {
                window.open(url, name, option);
            } else {
                alert('사용후기는 주문이 완료된 경우에만 작성하실 수 있습니다.');
            }
        });
    }

    // 리뷰(상품후기) 사용후기 수정 버튼
    const reviewUpdateBtn = document.querySelectorAll('.review_btn_wrap .modify_btn');
    if (reviewUpdateBtn) {
        reviewUpdateBtn.forEach(reviewBtn => {
            reviewBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.open(this.getAttribute('href'), 'review_update', 'width=793, height=745');
            });
        });
    }

    // 리뷰(상품후기) 삭제 버튼
    const reviewDeleteBtn = document.querySelectorAll('.review_btn_wrap .delete_btn');
    if (reviewDeleteBtn) {
        reviewDeleteBtn.forEach(reviewBtn => {
            reviewBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (confirm('사용후기를 삭제하시겠습니까?')) {
                    fetchCall(this.getAttribute('href'), {}, 'DELETE', function (data) {
                        alert(data.message);
                        if (data.status === 'OK') {
                            location.reload();
                        }
                    });
                }
            });
        });
    }

    // 상품 문의하기 클릭 시 팝업 열림
    const goodsQnaBtn = document.querySelector('#item_qa .box_action a');
    if (goodsQnaBtn) {
        const url = goodsQnaBtn.getAttribute('href');
        const name = 'qna_write';
        const option = 'width=793, height=745';

        goodsQnaBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const isLogin = this.closest('.right').dataset.islogin;

            if (isLogin === 'true') {
                window.open(url, name, option);
            } else {
                alert('상품문의는 회원만 작성 가능합니다.');
            }
        });
    }

    // Q&A 게시글 수정 버튼 클릭 시 수정 페이지 띄우기
    const modifyBtns = document.querySelectorAll('.qa_btn_wrap .modify_btn');
    if (modifyBtns) {
        modifyBtns.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                const url = btn.getAttribute('href');
                const name = 'qna_update';
                const option = 'width=793, height=745';

                window.open(url, name, option);
            });
        });
    }

    // Q&A 게시글 삭제 버튼 클릭 시 글 삭제
    const deleteBtns = document.querySelectorAll('.qa_btn_wrap .delete_btn');
    if (deleteBtns) {
        deleteBtns.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const no = this.dataset.no
                if (no && confirm('정말로 삭제하시겠습니까?')) {
                    fetchCall(`/rest/askDelete/${no}`, {}, 'DELETE', function (data) {
                        alert(data.message);
                        if (data.status === 'OK') {
                            location.reload();
                        }
                    });
                }
            });
        });
    }


//-----------------------------금액 관련--------------------------------
    // 총 금액
    const cost = document.getElementById('realCost');
    if (cost) {
        // 총 금액에 값 넣기
        const unitCost = parseInt(sizeSelect.dataset.price);
        const unitTitle = sizeSelect.dataset.title;
        const unitName = sizeSelect.dataset.name;
        const unitPoster = sizeSelect.dataset.poster;
        const unitNo = sizeSelect.dataset.no;
        let realCo = unitCost;
        // 로컬 스토리지에 담을 객체
        let cartObject = {
            size: '',
            media: '1',
            retouch: '1',
            frame: '캔버스판넬',
            blank: '없음',
            amount: '1',
            unit: `${unitCost}`,
            title: `${unitTitle}`,
            name: `${unitName}`,
            poster: `${unitPoster}`,
            goods_no: `${unitNo}`,
        }

        function costUpdate(getCost) {
            // item에 값 담기
            sessionStorage.setItem('item', JSON.stringify(cartObject));
            // 미디어
            if (cartObject.media === '2') {
                getCost += 4200;
            }
            // 프레임
            if (cartObject.frame === '띄움') {
                getCost += 4200;
            } else if (cartObject.frame === '원목 띄움') {
                getCost += 16900;
            } else if (cartObject.frame === '울림 우드') {
                getCost += 25400;
            } else if (cartObject.frame === '원목베이지') {
                getCost += 29600;
            } else if (cartObject.frame === '관우드' || cartObject.frame === '관블랙' || cartObject.frame === '관화이트') {
                getCost += 27500;
            }
            // 여백
            if (cartObject.blank === '3cm') {
                getCost += 8400;
            } else if (cartObject.blank === '6cm') {
                getCost += 16900;
            } else if (cartObject.blank === '11cm') {
                getCost += 33100;
            } else if (cartObject.blank === '15cm') {
                getCost += 44500;
            }
            // 수량
            getCost = getCost * cartObject.amount;
            // 10의 자리 버림
            getCost = Math.floor(getCost / 100) * 100;
            // 화면에 총 금액 표시
            cost.innerText = getCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // 페이지 로딩 시 기본으로 로컬 스토리지 생성
        costUpdate(realCo);

        // 그림사이즈 선택
        sizeSelect.addEventListener('change', function () {
            // 최초 시 초기화
            realCo = unitCost;
            // 30 * 30
            if (sizeSelect.value === '1') {
                if (unitCost < 40000) {
                    realCo *= 2;
                } else if (unitCost >= 40000 && unitCost < 60000) {
                    realCo *= 1.9;
                } else {
                    realCo *= 1.5;
                }
                cartObject.size = 1;
                // 35 * 35
            } else if (sizeSelect.value === '2') {
                if (unitCost < 40000) {
                    realCo *= 2.7;
                } else if (unitCost >= 40000 && unitCost < 60000) {
                    realCo *= 2.4;
                } else {
                    realCo *= 1.8;
                }
                cartObject.size = 2;
            }
            costUpdate(realCo);
        });

        // 캔버스 또는 파인아트
        const media = document.querySelectorAll('#option_scroll .media_select input[type=radio]');
        media.forEach(item => item.addEventListener('click', function () {
            cartObject.media = item.value;
            // 기본값 지정 변경
            if (item.value === '2') {
                cartObject.frame = '띄움';
            } else {
                cartObject.frame = '캔버스판넬';
            }
            costUpdate(realCo);
        }));

        // 마띠에르 retouch (배송비 +2000)
        const matiere = document.querySelectorAll('#option_scroll .retouch input[type=radio]');
        matiere.forEach(item => {
            item.addEventListener('click', function () {
                if (item.checked) {
                    cartObject.retouch = item.value;
                }
                costUpdate(realCo);
            });
        });

        // 프레임 선택
        const frame = document.querySelectorAll('#option_scroll .fopt_wrap label p');
        frame.forEach(item => item.closest('label').addEventListener('click', function () {
            cartObject.frame = item.textContent;
            costUpdate(realCo);
        }));

        // 여백
        const blank = document.querySelectorAll('#matopt1 label p');
        blank.forEach(item => item.closest('label').addEventListener('click', function () {
            cartObject.blank = item.textContent;
            costUpdate(realCo);
        }));

        // 수량
        const qtyBtns = document.querySelectorAll('#qty_area .opt_count button');
        qtyBtns.forEach(item => {
            item.addEventListener('click', function () {
                cartObject.amount = _num;
                costUpdate(realCo);
            });
        });

        const goCart = document.getElementById('go_cart');
        goCart.addEventListener("click", function (e) {
            e.preventDefault();
            // size 선택이 안되었다면 이동 막기
            if (cartObject.size !== '') {
                let cartKey = 'cartItem';
                let cartIndex = 1;

                // cartIndex에 값이 있나 확인
                while (localStorage.getItem(cartKey + cartIndex) && localStorage.length + 1) {
                    cartIndex++;
                }
                // 로컬 스토리지에 값 담기
                localStorage.setItem(cartKey + cartIndex, JSON.stringify(cartObject));
                // 이동
                location.href = '/shop/cart';
            }
        });
    }
});