window.addEventListener('DOMContentLoaded', function () {
    // 상품 문의하기 팝업 닫기
    const popCloseBtn = document.querySelector('#qa_write .close_btn');
    if (popCloseBtn) {
        popCloseBtn.addEventListener('click', function () {
            window.close();
        });
    }


    /* qna_write 페이지 작성완료 버튼 */
    const qnaSubmit = document.querySelector('.qna_write_container .qna_form .submit_btn');
    if (qnaSubmit) {
        qnaSubmit.addEventListener('click', function (e) {
            e.preventDefault();
            // 데이터 전송
            const formData = new FormData(this.closest('form'));
            // loginVO에 들어갈 수 있는 JSON 타입만 추출
            const jsonData = Object.fromEntries(formData.entries());
            let _url = '/rest/askInsert';

            fetchCall(_url, jsonData, 'POST', function (data) {
                if (data.status === 'OK') {
                    popCloseBtn.click();
                    opener.location.reload();
                } else {
                    alert(data.message);
                }
            });
        });
    }

    /* review_write 페이지 작성완료 버튼 */
    const reviewSubmit = document.querySelector('.goods_review_container .qna_form .submit_btn');
    if (reviewSubmit) {
        reviewSubmit.addEventListener('click', function (e) {
            e.preventDefault();
            // 데이터 전송
            const formData = new FormData(this.closest('form'));
            // loginVO에 들어갈 수 있는 JSON 타입만 추출
            const jsonData = Object.fromEntries(formData.entries());

            let _url = '/rest/reviewInsert';
            if (this.closest('form').dataset.type === 'update') {
                _url = '/rest/reviewUpdate';
            }

            fetchCall(_url, jsonData, 'POST', function (data) {
                if (data.status === 'OK') {
                    popCloseBtn.click();
                    opener.location.reload();
                } else {
                    alert(data.message);
                }
            });
        });
    }

    /* 별점 */
    const ratingStars = [...document.getElementsByClassName("rating__star")];
    const ratingResult = document.querySelector(".rating__result");
    const ratingPoint = document.getElementById('rating');

    printRatingResult(ratingResult, ratingPoint.value);
    executeRating(ratingStars, ratingResult);
});

/* 별점 */
function executeRating(stars, result) {
    const starClassActive = "rating__star fas fa-star";
    const starClassUnactive = "rating__star far fa-star";
    const starsLength = stars.length;
    let i;
    stars.map((star) => {
        star.onclick = () => {
            i = stars.indexOf(star);

            if (star.className.indexOf(starClassUnactive) !== -1) {
                printRatingResult(result, i + 1);
                for (i; i >= 0; --i) stars[i].className = starClassActive;
            } else {
                printRatingResult(result, i);
                for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
            }
        };
    });
}

function printRatingResult(result, num = 0) {
    result.value = `${num}`;
}