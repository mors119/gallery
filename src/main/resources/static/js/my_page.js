window.addEventListener('DOMContentLoaded', function () {
    // 주문목록/배송조회 탭 조회기간 클릭 시 on 클래스 부여
    const periodBtns = document.querySelectorAll('.period button');
    if (periodBtns) {
        periodBtns.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                set_date(btn.dataset.day);
                periodBtns.forEach(i => i.classList.remove('on'));
                btn.classList.add('on');
            });
        });
    }

    // 주문목록/배송조회 탭 조회기간 클릭 시 date_box 날짜 변경
    function set_date(today) {
        // 현재 날짜 가져오기
        let currentDate = new Date();
        // 현재 날짜 세팅
        document.getElementById('edate').value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}` ;

        // 지정한 개월 수만큼 이전 날짜로 설정
        currentDate.setMonth(currentDate.getMonth() - today);

        // 날짜 형식 맞추기 (YYYY-MM-DD)
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        let day = String(currentDate.getDate()).padStart(2, '0');

        let endDate = document.getElementById('edate');

        // 고정된 input 요소에 날짜 설정
        document.getElementById('sdate').value = `${year}-${month}-${day}`;
    }

    // 찜 리스트 체크박스 클릭 시
    const checkedAll = document.getElementById('check_all');
    const checkedOne = document.querySelectorAll(
        '.checkbox input[type=checkbox]'
    );
    if (checkedAll) {
        // 전체 선택 체크박스 클릭 시 checked 상태 확인해서 나머지 체크 박스 설정
        checkedAll.addEventListener('change', function () {
            const isChecked = this.checked;

            checkedOne.forEach((item) => {
                item.checked = isChecked;
            });
        });
    }

    // my_page
    const orderInfo = document.querySelector('.order .read_more_btn');
    if (orderInfo) {
        orderInfo.addEventListener('click', function (e) {
            e.preventDefault();
            alert('주문이 존재하지 않습니다.')
        })
    }

    // 찜리스트 삭제하기 버튼
    const wishDeleteBtns = document.querySelectorAll('.delete_wish');
    if (wishDeleteBtns) {
        wishDeleteBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const no = this.dataset.no;
                if (confirm('해당 상품을 삭제하시겠습니까?')) location.href = `/my/deleteWish?no=${no}`;
            });
        });
    }

    // 찜리스트 선택삭제
    const deleteWishBtn = document.querySelector('.wish_opt_wrap .deleteWishBtn');
    if (deleteWishBtn) {
        deleteWishBtn.addEventListener('click', function () {
            const wishCheckBoxs = document.querySelectorAll('[id^="check_one"]');
            const tmpList = [...wishCheckBoxs].filter(v => v.checked);
            if (tmpList.length) {
                if (confirm('선택 상품을 삭제하시겠습니까?')) {
                    const arr = [];
                    tmpList.forEach(v => {
                        const no = v.closest('.td_checkbox').dataset.no;
                        arr.push(no);
                    });
                    location.href = `/my/deleteWish?no=${arr.join()}`;
                }
            }
        });
    }

    // 찜리스트 리스트 비우기
    const clearWishBtn = document.querySelector('.wish_opt_wrap .clearWishBtn');
    if (clearWishBtn) {
        clearWishBtn.addEventListener('click', function () {
             const wishCheckBoxs = document.querySelectorAll('[id^="check_one"]');
             if (wishCheckBoxs.length) {
                 if (confirm('모든 상품을 삭제하시겠습니까?')) {
                     const arr = [];
                     wishCheckBoxs.forEach(v => {
                         const no = v.closest('.td_checkbox').dataset.no;
                         arr.push(no);
                     });
                     location.href = `/my/deleteWish?no=${arr.join()}`;
                 }
             }
        });
    }

    // 회원 정보변경 / 탈퇴
    const memberWithdrawal = document.querySelector('.my_infoC_container .fmemberconfirm');
    if (memberWithdrawal) {
        memberWithdrawal.addEventListener('submit', function (e) {
            e.preventDefault();
            const _id = this.querySelector('#mb_confirm_id').value;
            const _name = this.querySelector('#name').value;
            const originPw = this.querySelector('#originPw').value;
            const inputPw = this.querySelector('#mb_confirm_pw').value.trim();

            if (originPw === inputPw) {
                // 회원수정
                if (location.pathname === '/my/info_change') {
                    location.href = '/my/info_update';
                }
                // 회원 탈퇴
                else {
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    if (confirm('정말 탈퇴하시겠습니까?')) {
                        fetchCall(`/rest/withdrawal`, {id : _id, pw : inputPw}, 'DELETE', function (data) {
                            if (data > 0) {
                                alert(`${_name}님께서는 ${formattedDate}일에 회원에서 탈퇴 하셨습니다.`);
                                location.href = "/logout";
                            } else {
                                alert('잠시후 다시 시도하시거나 \n관리자에게 문의해 주세요.');
                            }
                        });
                    }
                }
            } else {
                alert('비밀번호가 틀립니다.');
            }
        });
    }

    initInfoUpdate();

    // inquiry
    const myOrder = document.getElementById('order_my_order');

    if(myOrder) {
        const products = myOrder.dataset.product;
        const items = products.trim().split(/\n\n/); // 빈 줄로 항목 분리

        const product = items.map(item => {
            const lines = item.split('\n');

            const title = lines[0].trim();
            const unit = parseInt(title.match(/\d+/g).join(''), 10);
            const no = lines.find(line => line.startsWith("번호")).split(' : ')[1].trim();
            const poster = lines.find(line => line.startsWith("이미지")).split(' : ')[1].trim();
            const size = lines.find(line => line.startsWith("사이즈")).split(' : ')[1].trim();
            const sizeP = parseInt(size.match(/\(\+\d+[,\d]*\)/g)?.[0]?.match(/\d+/g)?.join(''), 10);
            const media = lines.find(line => line.startsWith("미디어")).split(' : ')[1].trim();
            const mediaP = parseInt(media.match(/\d+/g).join(''), 10);
            const retouch = lines.find(line => line.startsWith("리터치")).split(' : ')[1].trim();
            const retouchP = parseInt(retouch.match(/\d+/g).join(''), 10);
            const frame = lines.find(line => line.startsWith('프레임')).split(' : ')[1].trim();
            const frameP = parseInt(frame.match(/\d+/g).join(''), 10);
            const blank = lines.find(line => line.startsWith('매트(여백)')).split(' : ')[1].trim();
            const blankP = parseInt(blank.match(/\d+/g).join(''), 10);
            const amount = parseInt(lines.find(line => line.startsWith('수량')).split(' : ')[1].trim(), 10);
            const total = (unit + sizeP + mediaP + retouchP + frameP + blankP) * amount;

            return {title, unit, no, poster, size, media, retouch, frame, blank, amount, total};
        });

    }
});

function initInfoUpdate() {
    const myInfo = document.getElementById('myInfo');
    if (myInfo) {
        console.log(myInfo.dataset.info);
    }
}