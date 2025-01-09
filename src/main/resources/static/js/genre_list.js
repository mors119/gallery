window.addEventListener('DOMContentLoaded', function () {
    const stickyTab = document.querySelector('.sticky_select');
    let lastScrollTop = 0;
    if (stickyTab) {
        window.addEventListener('scroll', function () {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;

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

            lastScrollTop = scrollTop;
        });
    }
});
