document.addEventListener('DOMContentLoaded', function () {
    // ------------------------- artist list -------------------------------
    const artistUl = document.querySelectorAll('.artist_list .select_wrap li a');
    if (artistUl) {
        // artistUl 클릭 시
        artistUl.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();

                // All 상태 변경
                document.querySelector('.select_wrap .all > a').classList.toggle('on');

                artistUl.forEach(v => {
                    if (item !== v) v.classList.remove('on');
                });

                // 하위
                const sortDepth = item.closest('.sort_depth');
                if (sortDepth) {
                    sortDepth.closest('li').querySelector('a').classList.toggle('on');
                } else {
                    item.classList.toggle('on');
                }

                const hrefValue = item.getAttribute('href');
                if (hrefValue !== '#') {
                    location.href = hrefValue;
                }
            });
        });
    }


    // ------------------------- artist info -------------------------------
    const artistName = document.querySelector('.artist_info .page_tit .title h1');
    if (artistName) {
        splitTitle(artistName);
    }
});

function splitTitle(title) {
    let content = title.textContent;
    let splitArr = [...content];
    let innerHTMLCnt = '';

    for (let i = 0; i < splitArr.length; i++) {
        if (i >= 10) {
            innerHTMLCnt += `<span class="split_letter" style="animation-delay: 1.${i}s;">${splitArr[i]}</span>`;
        } else if (i >= 20) {
            innerHTMLCnt += `<span class="split_letter" style="animation-delay: 2.${i}s;">${splitArr[i]}</span>`;
        } else {
            innerHTMLCnt += `<span class="split_letter" style="animation-delay: 0.${i}s;">${splitArr[i]}</span>`;
        }
    }
    title.innerHTML = innerHTMLCnt;
}