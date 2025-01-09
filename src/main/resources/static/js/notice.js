window.addEventListener('DOMContentLoaded', function () {
    // 리스트 (select box)
    const selectDeco = document.querySelector('.select_deco');
    if (selectDeco) {
        selectDeco.addEventListener('click', function () {
            this.classList.toggle('on');
        });
    }

    // 파일 선택
    const bfFile = document.getElementById('bf_file');
    if (bfFile) {
        bfFile.addEventListener('change', function (event) {
            const bfFileView = document.getElementById('bf_file1');
            const fileInput = event.target;
            if (fileInput.files.length) {
                bfFileView.textContent = fileInput.files[0].name;
            }
        });
    }

    // 이전글 / 다음글
    const noticeViewMove = document.querySelectorAll('.board_con_move .move');
    if (noticeViewMove) {
        noticeViewMove.forEach(move => {
            move.addEventListener('click', function (e) {
                e.preventDefault();
                const _link = this.dataset.link;
                const _no = this.dataset.no;
                if (_no) location.href = `${_link}/view/${_no}`;
            });
        });
    }

    // 글쓰기 submit
    const noticeSubmit = document.querySelector('.notice_btn_wrap a');
    if (noticeSubmit) {
        noticeSubmit.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('.notice_write form').submit();
        });
    }

    // 글삭제 버튼
    const noticeDeleteBtn = document.querySelector('.notice_delete_btn');
    if (noticeDeleteBtn) {
        noticeDeleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const _no = this.dataset.no;
            if (_no && confirm('게시글을 삭제하시겠습니까?')) location.href = `/notice/delete/${_no}`;
        });
    }

    // 검색타입 선택
    const selectSearchType = document.querySelectorAll('.select_deco ul li');
    if (selectSearchType) {
        selectSearchType.forEach(st => {
            st.addEventListener('click', function () {
                this.closest('.select_deco').querySelector('.current').innerText = this.innerText;
                this.closest('.select_deco').querySelector('#noticeSearchType').value = this.dataset.type;
            });
        });
    }
});
