window.addEventListener('DOMContentLoaded', function () {
    // 클릭시 내용 보기
    const faqOpenBtns = document.querySelectorAll('.faq_open');
    if (faqOpenBtns) {
        faqOpenBtns.forEach((v) => {
            v.addEventListener('click', function () {
                const currentFaqTitle = v.closest('.faq_title');

                // 모든 faq_title에서 on 클래스 제거
                document.querySelectorAll('.faq_title').forEach((title) => {
                    if (title !== currentFaqTitle) {
                        title.classList.remove('on');
                    }
                });

                // 현재 클릭 요소에만 on 추가
                currentFaqTitle.classList.toggle('on');
            });
        });
    }

    // 카테고리
    const faqMainBtn = document.querySelectorAll('.faq_menu li');
    if(faqMainBtn) {
        faqMainBtn.forEach((cate) => {
            cate.addEventListener('click', function(e) {
                e.preventDefault();
                faqMainBtn.forEach(m => m.classList.remove('action'));
                this.classList.add('action');

                // 카테고리 탭
                const hrefValue = this.querySelector('a').getAttribute('href');
                if (hrefValue) {
                    location.href = hrefValue;
                }
            });
        });
    }
});
