window.addEventListener('DOMContentLoaded', function () {
    // 이벤트 상세보기
    const eventViews = document.querySelectorAll('.event_content > ul li a');
    if (eventViews) {
        eventViews.forEach((view) => {
            view.addEventListener('click', function (e) {
                e.preventDefault();
                const isEnd = this.dataset.end;
                const _no = this.dataset.no;
                if (isEnd === 'N') {
                    location.href = `/event/view/${_no}`;
                }
            });
        });
    }
});
