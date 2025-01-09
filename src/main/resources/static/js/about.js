document.addEventListener('DOMContentLoaded', function () {
    // *** h1 효과
    const splitTxt = document.querySelector('.about_page .split_txt');
    if (splitTxt) {
        let content = splitTxt.textContent;
        let splitArr = [...content];
        let innerHTMLCnt = '';

        for (let i = 0; i < splitArr.length; i++) {
            if (i >= 10) {
                innerHTMLCnt += `<span class="split_letter" style="animation-delay: 1.${i}s;">${splitArr[i]}</span>`;
            } else {
                innerHTMLCnt += `<span class="split_letter" style="animation-delay: 0.${i}s;">${splitArr[i]}</span>`;
            }
        }

        splitTxt.innerHTML = innerHTMLCnt;
    }
});
