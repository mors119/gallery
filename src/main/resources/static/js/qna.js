window.addEventListener('DOMContentLoaded', function () {
    // 글쓰기 버튼
    const qnaWriteBtn = document.querySelector('.qna_write_wrap a');
    if (qnaWriteBtn) {
        qnaWriteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const isLogin = this.closest('.qna_write_wrap').dataset.islogin;
            if (isLogin === 'true') location.href = '/qna/write';
            else alert('회원이시라면 로그인 후 이용해 보십시오.');
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

    // 글쓰기 submit
    const qnaSubmit = document.querySelector('.qna_btn_wrap a');
    if (qnaSubmit) {
        qnaSubmit.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('.qna_write form').submit();
        });
    }

    // 상세보기
    const qnaListView = document.querySelectorAll('.qna_list .list_cont tr a');
    if (qnaListView) {
        qnaListView.forEach(view => {
            view.addEventListener('click', function (e) {
                e.preventDefault();
                const _no = this.dataset.no;
                if (_no) location.href = `/qna/view/${_no}`;
            });
        });
    }

    // 이전글 / 다음글
    const qnaViewMove = document.querySelectorAll('.qnaview_con_move .move');
    if (qnaViewMove) {
        qnaViewMove.forEach(move => {
            move.addEventListener('click', function (e) {
                e.preventDefault();
                const _no = this.dataset.no;
                if (_no) location.href = `/qna/view/${_no}`;
            });
        });
    }

    // 삭제하기 버튼
    const qnaDeleteBtn = document.querySelector('.qnaview_con_wrap .qna_delete_btn');
    if (qnaDeleteBtn) {
        qnaDeleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('한번 삭제한 자료는 복구할 방법이 없습니다.\n\n정말 삭제하시겠습니까?')) {
                const _no = this.dataset.no;
                if (_no) {
                    fetchCall(`/qna/delete/${_no}`, {}, 'DELETE', function (data) {
                        if (data !== 0) location.href = '/qna/list';
                        else alert('잠시후 다시 시도하거나,\n관리자에게 문의하십시오.');
                    });
                }
            }
        });
    }

});