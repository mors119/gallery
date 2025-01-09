window.addEventListener('DOMContentLoaded', function () {
    // 상품 문의하기 팝업 닫기
    const popCloseBtn = document.querySelector('#qa_write .close_btn');
    if (popCloseBtn) {
        popCloseBtn.addEventListener('click', function () {
            window.close();
        });
    }

    const submitBtn = document.querySelector('.qna_form .submit_btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // 데이터 전송
            const formData = new FormData(this.closest('form'));
            // loginVO에 들어갈 수 있는 JSON 타입만 추출
            const jsonData = Object.fromEntries(formData.entries());
            let _url = '/rest/askUpdate';

            fetchCall(_url, jsonData, 'POST', function (data) {
                alert(data.message);
                if (data.status === 'OK') {
                    popCloseBtn.click();
                    opener.location.reload();
                }
            });
        });
    }

});