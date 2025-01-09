document.addEventListener('DOMContentLoaded', async function () {
    // *** ------ main page ------------


    // ------------------------------- login page -------------------------------
    // *** login & Find change button
    const lAFBtn = document.querySelectorAll('.login_page .login_cnt .login_a a');
    const formShow = document.querySelectorAll('.login_page .login_cnt .form');
    if (lAFBtn.length > 0) {
        lAFBtn.forEach((item, idx) => {
            item.addEventListener('click', function () {
                lAFBtn.forEach((btn) => btn.classList.remove('active'));
                item.classList.add('active');
                // from 태그 전환
                formShow.forEach((form) => form.classList.remove('active'));
                formShow[idx].classList.add('active');
            });
        });
        // 이전 페이지에 따른 active 전환
        if (formShow[0]) {
            if (formShow[0].dataset.cart === '1') {
                formShow[1].classList.add('active');
                lAFBtn[1].classList.add('active');
            } else {
                formShow[0].classList.add('active');
                lAFBtn[0].classList.add('active');
            }
        }
        // login 실패 시 메시지
        const msg = document.querySelector('.login_page .msg');
        if (msg) {
            alert(msg.innerText);
        }
    }

    // *** 로그인 정보 저장 checkbox ------------------------------------------------------------------
    const check = document.querySelector('#save_id');
    if (check) {
        const localId = localStorage.getItem('saveId');
        // 로컬 스토리지에 id 값이 있으면 체크박스 체크 & input[name=id] 채우기
        if (localId) {
            document.getElementById('localId').value = localId;
            check.checked = true;
        }
        // 아이디 저장 체크 박스
        check.addEventListener('click', function () {
            if (check.checked) {
                const confirmText = confirm(
                    '자동로그인을 사용하시면 다음부터 회원아이디와 비밀번호를 입력하실 필요가 없습니다.\n\n' +
                    '공공장소에서는 개인정보가 유출될 수 있으니 사용을 자제하여 주십시오.\n\n' +
                    '자동로그인을 사용하시겠습니까?'
                );
                // confirm 취소 버튼 클릭 시
                if (!confirmText) {
                    check.checked = false;
                }
            } else {
                // 체크박스 비활성화 시 로컬스토리지 지우기
                localStorage.removeItem('saveId');
            }
        });
    }

    // 로그인 버튼 클릭(submit) 시
    const loginForm = document.querySelector('#login_form');
    if (loginForm) {
        loginForm.addEventListener('submit', function () {
            const idInput = document.getElementById('localId');
            // 체크 박스가 체크 && id 입력 창에 id가 있다면
            if (check.checked && idInput) {
                // localStorage 에 id 값 저장
                localStorage.setItem('saveId', idInput.value);
            } else {
                // localStorage 에 있는 id 지우기
                localStorage.removeItem('saveId');
            }
        });
    }

    // 아이디 비밀번호 찾기 창 열기
    const openFind = document.querySelector('.login_page .open_find_member');
    if (openFind) {
        const findMember = document.querySelector('.login_page .find_member');
        const closeBtn = [
            document.querySelector('.login_page .find_member ._x'),
            document.querySelector('.login_page .find_member .join_btn_wrap .silver'),
        ];
        // 열기 함수
        openFind.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFindMember(true);
        });
        // 닫기 함수 (모든 닫기 버튼에 동일한 리스너 적용)
        closeBtn.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFindMember(false);
        }));

        // 카트 => 비회원 주문 시
        const nMBtn = document.querySelector('#no_member .nm_btn');
        const nMS = document.querySelectorAll('#no_member .nm_tos a');

        nMBtn.addEventListener('click', function (e) {
            e.preventDefault();
            let allChecked = true;
            for (let i = 1; i <= nMS.length; i++) {
                if (!document.getElementById(`ch${i}`).checked) {
                    allChecked = false;
                    if(i === 1) {
                        alert('사이트 이용약관을 읽고 이에 동의하셔야 합니다.');
                    } else {
                        alert('개인정보처리방침을 읽고 이에 동의하셔야 합니다.');
                    }
                }
            }
            if(allChecked === true) {
                location.href = '/shop/order?check=true';
            }
        });

        const xBtn = document.querySelectorAll('#text_wrap ._x_btn');
        const blackWrap = document.getElementById('black_wrap');
        const textWrap = document.getElementById(`text_wrap`).children;
        if(blackWrap) {
            nMS.forEach((item, idx) => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    textWrap[idx].classList.add('on');
                    blackWrap.classList.add('on');
                });
            });
            xBtn.forEach((item, idx) => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    textWrap[idx].classList.remove('on');
                    blackWrap.classList.remove('on');
                });
            });
            blackWrap.addEventListener('click', function () {
                toggleFindMember(false);
            });
        }
        // 모듈화된 toggle 함수
        function toggleFindMember(state) {
            findMember.classList.toggle('on', state);
            if (state) {
                blackWrap.classList.add('on');
            } else if (!state) {
                blackWrap.classList.remove('on');
            }
        }

        // 메일 발송 후 alert창 활성화 확인 후 main page로 이동 메일 부분
        const emailInput = document.querySelector('.login_page .find_member input[type=email]');
        const sendEmail = document.getElementById('send_email_submit');
        sendEmail.addEventListener('click', function (e) {
            e.preventDefault();
            // 쿼리 파라미터로 이메일 전달
            fetch(`/rest/findMember/${emailInput.value}`, {
                method: 'GET',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // JSON 변환
                })
                .then(result => {
                    if (result === 1) {
                        alert(`${emailInput.value} 메일로 회원아이디와 비밀번호를 인증할 수 있는 메일이 발송 되었습니다.\n\n메일을 확인하여 주십시오.`);
                        window.location = '/login';
                    } else {
                        alert('이메일 전송에 실패했습니다. 다시 시도해 주세요.');
                    }
                })
                .catch(err => console.error('Error:', err));

        });
    }

    //--------------------------- join_tos_page ------------------------------------
    // *** Checkbox
    const checkAll = document.querySelector('#check_all');
    const checkSite = document.querySelector('#check_site');
    const checkPrivate = document.querySelector('#check_private');
    if (checkAll) {
        // 개별 체크박스를 배열로 변환
        const checkboxes = Array.from([checkSite, checkPrivate]);

        // --- 전체 동의 클릭 시
        checkAll.addEventListener('click', function () {
            const isChecked = checkAll.checked; // 전체 체크박스 상태
            checkboxes.forEach((checkbox) => {
                checkbox.checked = isChecked; // 개별 체크박스에 동일한 상태 적용
            });
        });

        // --- 개별 체크박스 클릭 시 "전체 동의" 상태 업데이트
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('click', function () {
                checkAll.checked = checkboxes.every((item) => item.checked); // 모든 체크박스가 체크되었는지 확인
            });
        });

        // --- 체크박스 상태에 따라 회원가입 버튼 클릭 처리
        const joinNextBtn = document.querySelector('#join_next_btn');
        joinNextBtn.addEventListener('click', function (e) {
            if (!checkSite.checked) {
                e.preventDefault();
                alert('회원가입약관의 내용에 동의하셔야 회원가입 하실 수 있습니다.');
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            } else if (!checkPrivate.checked) {
                e.preventDefault();
                alert(
                    '개인정보처리방침안내의 내용에 동의하셔야 회원가입 하실 수 있습니다.',
                );
            }
        });
    }

    // -----------------------------join main--------------------------------
    const joinSubmit = document.getElementById('join');
    if (joinSubmit) {
        // *** 아이디 중복확인
        let idCheckNum = 0;
        const checkId = document.getElementById('id_check');
        const inputText = document.getElementById('input_text_id');
        checkId.addEventListener('click', function () {
            const id = document.getElementById('input_text_id').value;
            fetch(`/rest/idCheck/${id}`, {
                method: 'GET',
            }).then(response => {
                if (response.ok) {
                    return response.json(); // 요청 성공
                }
            }).then(result => {
                if (result === 0) {
                    idCheckNum++;
                    if (!confirm('가입할 수 있는 아이디입니다.\n현재 아이디를 사용하시겠습니까?')) {
                        inputText.value = '';
                        idCheckNum = 0;
                    }
                } else {
                    alert('이미 존재하는 아이디입니다.');
                }
            }).catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
        });

        // *** select: ul tag > li (option) 생성
        const selectWrap = document.querySelectorAll(
            '.join_page .join_input .input_wrap .select_wrap',
        );

        function makeOption(selectId, ulId, start, end, padStart) {
            const select = document.getElementById(selectId);
            const ul = document.getElementById(ulId);
            let defaultVal = parseInt(select.innerText, 10) || start;

            if (padStart) {
                select.innerText = defaultVal.toString().padStart(padStart, '0');
            }

            const step = selectId !== 'year_select' ? 1 : -1;
            const loopStart = step === 1 ? start : end;
            const loopEnd = step === 1 ? end : start;

            for (let i = loopStart; (step === 1 ? i <= loopEnd : i >= loopEnd); i += step) {
                const li = document.createElement('li');
                li.textContent = i;
                li.addEventListener('click', () => {
                    select.textContent = i;
                });
                ul.appendChild(li);

                // 기본 값에서 스크롤 시작
                // if (i === defaultVal) {
                //     li.scrollIntoView({ block: 'start', behavior: 'smooth' });
                // }
            }

            selectWrap.forEach((item) => {
                item.addEventListener('click', function () {
                    item.classList.toggle('on');
                });
            });

            // 다른 요소 클릭 시 option 닫기
            document.addEventListener('click', function (e) {
                selectWrap.forEach((item) => {
                    if (!item.contains(e.target)) {
                        item.classList.remove('on');
                    }
                });
            });
        }

        let today = new Date();
        let nowYear = today.getFullYear();
        // select 생성 값 넣기
        makeOption('year_select', 'join_year', 1900, nowYear, 0);
        makeOption('month_select', 'join_month', 1, 12, 2);
        makeOption('day_select', 'join_day', 1, 31, 2);

        // *** 주소 찾기 kakao.api ----
        const address = document.getElementById('address');
        const postCode = document.getElementById('zoneCode');

        function postcode() {
            new daum.Postcode({
                oncomplete: function (data) {
                    let addr = data.address; // 최종 주소 변수
                    let postC = data.zonecode; // 새 우편 주소
                    // 주소 정보를 해당 필드에 넣는다.
                    address.value = addr;
                    postCode.value = postC;
                },
            }).open();
        }

        document.getElementById('click_post').addEventListener('click', function () {
            postcode();
            document.querySelector('.join_page .input .address').focus();
        });


        // *** radio ----
        const inputRadio = document.querySelectorAll(
            '.join_page .join_input .input_wrap .input input[type=radio]',
        );
        inputRadio.forEach((item) => {
            item.addEventListener('click', function () {

                inputRadio.forEach(radio => radio.checked = false);
                item.checked = true;

                if (item.id === 'radio_yes') {
                    document.getElementById('radio_val').value = 'Y';
                } else if (item.id === 'radio_no') {
                    document.getElementById('radio_val').value = 'N';
                }
            });
        });


        // *** Captcha ----
        function onHandleClick(e) {
            e.preventDefault();
            grecaptcha.enterprise.ready(async () => {
                const token = await grecaptcha.enterprise.execute('6Lf8bJgqAAAAAEqFQxGdrRQT_K2Yu1ESqCR-cGl7', {action: 'LOGIN'});
            });
        }

        joinSubmit.addEventListener('submit', function (e) {
            e.preventDefault(); // 기본 form 전송 막기

            if (idCheckNum < 1 && location.pathname.startsWith('/join')) {
                alert('아이디 중복확인을 해주세요.');
                return;
            }
            // 비밀번호 같은 지 확인
            const pw = document.getElementById('input_pw').value.trim();
            const pwC = document.getElementById('input_pw_ch').value.trim();
            if (pw !== pwC) {
                alert('같은 비밀번호를 입력해주세요.');
                return;
            }
            const inputName = document.getElementById('input_name');
            // 이메일 형식 검사
            const email = document.getElementById('input_email').value.trim();
            //     ^ (== 시작/^), [^\s@]+ (== 공백 문자와 @를 제외한 한 글자 이상의 연속된 문자)
            //     @ (== @반드시 포함), [^\s@]+ (== @를 제외한 한 글자 이상의 연속된 문자)
            //     \. (== . 이후), [^\s@]+ (== 역시 공백 문자와 @를 제외한 문자), $ (== 이렇게 끝나야 함)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("이메일 형식이 올바르지 않습니다.");
                return;
            }
            // 휴대폰 번호 형식 검사
            const phone = document.getElementById('input_phone').value.trim();
            const phoneRegex = /^(010[-.\s]?\d{4}[-.\s]?\d{4}|01[16789][-.\s]?\d{3,4}[-.\s]?\d{4})$/;
            if (!phoneRegex.test(phone)) {
                alert("휴대폰 번호 형식이 올바르지 않습니다.");
                return;
            }

            // 날짜 select 값 넣기
            const year = document.getElementById('year_select').textContent.trim();
            const month = document.getElementById('month_select').textContent.trim().padStart(2, '0'); // 두 자릿수
            const day = document.getElementById('day_select').textContent.trim().padStart(2, '0'); // 두 자릿수

            const dateValue = `${year}-${month}-${day}`;
            const inputValue = document.getElementById('input_birth');
            // 값 넣기
            inputValue.value = dateValue;

            // 데이터 전송
            const formData = new FormData(this);
            // loginVO에 들어갈 수 있는 JSON 타입만 추출
            const jsonData = Object.fromEntries(formData.entries());

            let _url = '/rest/joinInsert';
            if (location.pathname.startsWith('/my/info_update')) {
                _url = '/rest/memberUpdate';
            }

            fetchCall(_url, jsonData, 'POST', function (data) {
                if (data.status === 'OK') {
                    // 회원수정
                    if (location.pathname.startsWith('/my/info_update')) {
                        alert(data.message);
                    // 회원 가입
                    } else {
                        location.href = `/join_result?name=${inputName.value}`;
                    }
                } else {
                    alert('잠시후 다시 시도하거나 \n관리자에게 문의하세요.');
                }
            });
        });
    }
});
