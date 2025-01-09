window.addEventListener('DOMContentLoaded', function () {
    const supportCloseBtn = document.querySelector('.support_pop_wrap .btn_pop_close');
    if (supportCloseBtn) {
        supportCloseBtn.addEventListener('click', function () {
            document.body.classList.remove('on');
            const supportPopWrap = document.querySelector('.support_container .support_pop_wrap');
            supportPopWrap.style.opacity = '0';
            supportPopWrap.style.visibility = 'hidden';
        });
    }

    const supportAgreeOpen = document.querySelector('.support_agree .box_action a');
    if (supportAgreeOpen) {
        supportAgreeOpen.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.classList.add('on');
            const supportPopWrap = document.querySelector('.support_container .support_pop_wrap');
            supportPopWrap.style.opacity = '1';
            supportPopWrap.style.visibility = 'visible';
        });
    }
});
