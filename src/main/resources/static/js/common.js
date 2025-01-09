window.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        once: true,
        delay: 0,
        duration: 1200,
        easing: 'ease',
    });

    // 웹 에디터가 되기위해 editor 속성 찾기
    const editor = document.querySelector('[data-editor]');
    if (editor) {
        // 해당 속성 숨기기
        editor.style.display = 'none';

        // ID값 얻기
        const id = editor.getAttribute('id');
        // 데이터 VALUE 얻기
        const body = editor.dataset.editor;

        // 웹 에디터 생성함수 호출
        quill(id, body);
    }

    // header
    const sitemap = document.querySelector('#header .sitemap');
    const btnSitemapOpen = document.querySelector('#header .btn_sitemap_open');
    if (btnSitemapOpen) {
        btnSitemapOpen.addEventListener('click', function (e) {
            e.preventDefault();
            sitemap.classList.add('on');
        });
    }

    const btnSitemapClose = document.querySelector('#header .btn_sitemap_close');
    if (btnSitemapClose) {
        btnSitemapClose.addEventListener('click', function (e) {
            e.preventDefault();
            sitemap.classList.remove('on');
        });
    }

    if (sitemap) {
        sitemap.addEventListener('click', function (event) {
            const rect = this.getBoundingClientRect();
            const xAfter = rect.left + 640; // X 좌표

            // 클릭된 위치가 ::after 요소의 영역인지 확인
            if (event.clientX >= xAfter) {
                sitemap.classList.remove('on');
            }
        });
    }

    const sitemapAllmenu = document.querySelectorAll('#header .all_menu > li');
    if (sitemapAllmenu) {
        sitemapAllmenu.forEach((menu) => {
            menu.addEventListener('mouseenter', function () {
                this.classList.add('on');
            });
            menu.addEventListener('mouseleave', function () {
                this.classList.remove('on');
            });
        });
    }

    // header - 검색버튼
    const searchOpenBtn = document.querySelector('#header .btn_all_search_open');
    if (searchOpenBtn) {
        searchOpenBtn.addEventListener('click', function () {
            document.getElementById('search_wrap').classList.add('on');
            const schInput = document.getElementById('sch_str');
            schInput.value = '';
            setTimeout(() => {
                schInput.focus();
            }, 300)
        });
    }
    // 검색창 닫기
    const searchCloseBtn = document.querySelector('#search_wrap .search_close_btn');
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', function () {
            document.getElementById('search_wrap').classList.remove('on');
        });
    }
    // header cart value
    const basketNum = document.querySelector('#header .basket_num');
    if(basketNum) {
        basketNum.innerText = cartItem();
    }
    // localstorage에서 특정값만 가져오기
    function cartItem() {
        let count = 0;
        let pattern = "cartItem";

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(pattern)) {
                count++;
            }
        }
        return count;
    }

    // footer - 위로가기 공통
    const top_btn = document.querySelector('.top_btn');
    const stickyTab = document.querySelector('.sticky_select');
    let lastScrollTop = 0;
    if (top_btn) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop < lastScrollTop) { // up
                document.body.classList.remove('scroll_down');
                document.body.classList.toggle('scroll_up', window.scrollY > 0);

                // 스크롤 up 시 sticky top 좌표 변경
                if (stickyTab) {
                    stickyTab.style.top = '120px';
                }
            } else { // down
                document.body.classList.toggle('scroll_down', window.scrollY > 100);

                // 스크롤 down 시 sticky top 좌표 변경
                if (stickyTab) {
                    stickyTab.style.top = '20px';
                }
            }

            // 현재 스크롤 위치를 저장
            lastScrollTop = scrollTop;


            // 위로가기 버튼
            top_btn.classList.toggle('fixed', window.scrollY > 300);
        });

        const goTop = document.querySelector('.go_top');
        goTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // 찜 하기 버튼
    const likeBtns = document.querySelectorAll('.icon_wrap .like_icon');
    if (likeBtns) {
        likeBtns.forEach((item) => {
            item.addEventListener('click', function () {
                fetch(`/rest/like/${this.dataset.no}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status) {
                            if (data.result === '1') item.classList.toggle('on');
                            alert(data.message);
                        }
                    });
            });
        });
    }

    // 검색 페이지내 최근 검색어 클릭
    const recentWord = document.querySelectorAll('.recent_word');
    if (recentWord) {
        recentWord.forEach(word => {
            word.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById('sch_str').value = this.innerText.replace('#', '');
                this.closest('form').submit();
            });
        });
    }

    // 검색 페이지내 인기 검색어 클릭
    const schPopularWord = document.querySelectorAll('.sch_popular_word ul > li > a');
    if (schPopularWord) {
        schPopularWord.forEach(word => {
            word.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById('sch_str').value = this.innerText.replace(/^\d+\.\s*/, '');
                this.closest('form').submit();
            });
        });
    }

    // 검색 페이지내 좌측 장르별
    const genreWord = document.querySelectorAll('.search_list_wrap .sort_list_wrap .genre_list input[type=checkbox]');
    if (genreWord) {
        genreWord.forEach(word => {
            word.addEventListener('click', function (){
                const wordTypeEl = document.getElementById('word_type');
                const checkWordEl = document.getElementById('check_word');
                wordTypeEl.value = 'genre';
                checkWordEl.value = this.value;
                wordTypeEl.closest('form').submit();
            });
        });
    }

    // 검색 페이지내 좌측 주제별
    const subjectWord = document.querySelectorAll('.search_list_wrap .sort_list_wrap .subject_list input[type=checkbox]');
    if (subjectWord) {
        subjectWord.forEach(word => {
            word.addEventListener('click', function (){
                const wordTypeEl = document.getElementById('word_type');
                const checkWordEl = document.getElementById('check_word');
                wordTypeEl.value = 'subject';
                checkWordEl.value = this.value;
                wordTypeEl.closest('form').submit();
            });
        });
    }

}); // DOMContentLoaded

// 웹 에디터 생성 함수
function quill(id, body) {
    // div 태크 생성
    const template = document.createElement('div');
    // 속성, style, body 추가
    template.setAttribute('id', 'editor-container');
    template.setAttribute('style', 'width: 100%; height: 300px;');
    template.innerHTML = body;

    // 기존 태그뒤에 웹에디터 추가
    document.getElementById(id).after(template);

    // 웹 에디터 객체 생성
    const quill = new Quill('#editor-container', {
        placeholder: 'Compose an epic...',
        theme: 'snow',
    });

    // 서버에 전송을 위해 기존 태그에 추가된 내용을 붙이기
    quill.on('text-change', function () {
        document.getElementById(id).value = quill.root.innerHTML;
    });
}

function showLoading(isShow) {
    // 로딩 동적으로 생성
    const container = document.getElementById('container');
    let loadingBar = container.querySelector('#mosoLoading');

    if (!loadingBar) {
        loadingBar = document.createElement('img');
        loadingBar.src = '/images/common/loading.svg';
        loadingBar.alt = '로딩 중...';
        loadingBar.id = 'mosoLoading';
        loadingBar.style.position = 'fixed';
        loadingBar.style.top = '50%';
        loadingBar.style.left = '50%';
        loadingBar.style.transform = 'translate(-50%, -50%)';
        loadingBar.style.zIndex = '99999';
        loadingBar.style.display = 'block';

        // 로딩 영역에 추가
        container.appendChild(loadingBar);

        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        overlay.style.zIndex = '99998'; // 로딩바보다 낮게
        overlay.style.display = 'none'; // 처음에는 숨김

        // 오버레이 추가
        container.appendChild(overlay);
    }

    // 로딩 영역에 추가
    loadingBar.style.display = isShow ? 'block' : 'none';
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = isShow ? 'block' : 'none';

    // 키 입력 차단 및 클릭 이벤트 차단
    if (isShow) {
        window.onkeydown = function (e) {
            e.preventDefault();
        };
        overlay.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        overlay.onwheel = function (e) {
            e.preventDefault();
        };
    } else {
        // 키 입력 및 클릭 이벤트 복원
        window.onkeydown = null;
        overlay.onclick = null;
        overlay.onwheel = null;
    }
}

// post 방식으로 서버와 비동기 통신 함수
// 사용예시
// post('/Board/fetch', params, (data) => {
//		console.log(data);
//	});
function fetchCall(url, reqData, method, callback) {
    showLoading(true);
    let _method = 'POST';
    if (method) _method = method;

    // 설정
    const options = {
        method: _method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData), // json데이터로 변환
    };

    // 서버와 통신후 callback 응답하기위한 로직
    fetch(url, options)
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => console.log(err))
        .finally(() => showLoading(false));
}

// 입력값에 특정 문자가 포함되었는지 체크
function isContains(target, chars) {
    for (let i = 0; i < target.value.length; i++) {
        if (chars.indexOf(target.value.charAt(i)) !== -1) return true;
    }

    return false;
}

