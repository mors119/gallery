document.addEventListener('DOMContentLoaded', function () {
    // check box
    const chkAll = document.getElementById('chk_all');
    const selDel = document.getElementById('select_del');
    const allDel = document.getElementById('all_del');
    const tbody = document.querySelector('.cart_wrap .cart_order tbody');
    const totalId = document.getElementById('totalCost');
    const deliveryId = document.getElementById('delivery');
    const payId = document.getElementById('totalPay');
    if (chkAll) {
        howManyItem();
        const check = document.querySelectorAll('.cart_wrap .cart_order tbody input[type=checkbox]');
        const checkArr = [...check];
        // 모두 체크하거나 하지않기
        chkAll.addEventListener('click', function () {
            checkArr.forEach(item => {
                item.checked = chkAll.checked;
            });
        });
        checkArr.forEach(item => {
            item.addEventListener('click', function () {
                chkAll.checked = checkArr.every(chk => chk.checked);
            });
        });


        selDel.addEventListener('click', function () {
            checkArr.forEach((item, idx) => {
                if (checkArr[idx].checked) {
                    const id = checkArr[idx].id.substring(7);
                    localStorage.removeItem(`cartItem${id}`);
                }
            });
            howManyItem();
        });

        allDel.addEventListener('click', function () {
            localStorage.clear();
            howManyItem();
        })
    }

    // 아이템 생성 시도하고, 아이템이 없으면 화면요소 제거
    function howManyItem() {
        makeItem();
        if (tbody.children.length === 0) {
            tbody.innerHTML = `
                    <tr>
                        <td class="item_none" colspan="5">
                            <img src="/images/goods_view/ico-information-big.png" alt="알림">
                            <p>장바구니에 담긴 상품이 없습니다.</p>
                        </td>
                    </tr>
                `;
            document.querySelector('.cart_container .cart_price_wrap').remove();
            document.querySelector('.cart_container .cart_confirm_wrap a.active').remove();
        }
    }

    function cartItem() {
        // localstorage에서 특정값만 가져오기
        let count = 0;
        let pattern = "cartItem";

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(pattern)) {
                count++;
            }
        }
        return count;
    }

    function makeItem() {
        let tbodyContext = '';
        // 총 상품금액
        let totalCost = 0;
        // 배송비
        let delivery = 0;

        for (let i = 1; i <= cartItem(); i++) {
            let object = JSON.parse(localStorage.getItem(`cartItem${i}`));

            let sizePrice = sizeCo(object.unit, object.size);
            let blankPrice = blank(object.blank);
            let framePrice = frame(object.frame);
            // 리터치 필요 시 배송비 2000원 추가됨
            let totalPrice = (parseInt(sizePrice)
                    + blankPrice + framePrice
                    + parseInt(object.unit)
                    + (object.retouch === 1 ? 0 : 2500)
                    + (object.media === 1 ? 0 : 4200))
                * object.amount
            ;

            totalCost += totalPrice;
            delivery += object.retouch === 1 ? 0 : 2500;

            tbodyContext += `
                <tr>
                    <td>
                        <input type="checkbox" id="ct_chk_${i}" checked="checked" autocomplete="off">
                        <label for="ct_chk_${i}"><span></span><b class="blind">상품</b></label>
                    </td>
                    <td class="td_prd">
                        <div class="sod_img">
                            <a href="/shop/view/${object.goods_no}">
                                <img src="/images/goods/${object.poster}" alt="제품 이미지">
                            </a>
                        </div>
                        <div class="sod_name">
                            <a href="/shop/view/${object.goods_no}">
                                <dl>
                                    <dt>
                                        <strong>${object.title}</strong>
                                        <span class="f_color">${object.name}</span>
                                        <span class="price_txt">(+${commaStr(object.unit)})</span>
                                    </dt>
                                    <dd>사이즈 : ${object.size === 1 ? '30.0cm x 30.0cm' : '35.0cm x 35.0cm'}<span class="price_txt">(+${sizePrice})</span></dd>
                                    <dd>미디어 : ${object.media === 1 ? '캔버스' : '파인아트'}<span class="price_txt">(+${object.media === 1 ? '0' : '4,200'})</span></dd>
                                    <dd>리터치 : ${object.retouch === 1 ? '없음' : '선택'}<span class="price_txt">(+${object.retouch === 1 ? '0' : '2,500'})</span></dd>
                                    <dd>프레임 : ${object.frame}<span class="price_txt">(+${commaNum(framePrice)})</span></dd>
                                    <dd>매트(여백) : ${object.blank}<span class="price_txt">(+${commaNum(blankPrice)})</span></dd>
                                </dl>
                            </a>
                        </div>
                    </td>
                    <td>${commaStr(object.unit)} 원</td>
                    <td>${object.amount}</td>
                    <td>
                        <span class="total_prc">${commaNum(totalPrice)}</span> 원
                    </td>
                </tr>
           `;
        }

        // 화면에 값 넣기
        tbody.innerHTML = tbodyContext;
        totalId.innerText = commaNum(totalCost);
        deliveryId.innerText = commaNum(delivery);
        payId.innerText = commaNum(totalCost + delivery);
    }

    // 사이즈 비용 계산
    function sizeCo(unitCost, size) {
        let cost = unitCost;
        if (size === 1) {
            if (unitCost < 40000) {
                cost = unitCost * 2;
            } else if (unitCost >= 40000 && unitCost < 60000) {
                cost = unitCost * 1.9;
            } else {
                cost = unitCost * 1.5;
            }
            cost = cost - unitCost;
            // 35 * 35
        } else if (size === 2) {
            if (unitCost < 40000) {
                cost = unitCost * 2.7;
            } else if (unitCost >= 40000 && unitCost < 60000) {
                cost = unitCost * 2.4;
            } else {
                cost = unitCost * 1.8;
            }
            cost = cost - unitCost;
        }
        if (cost === unitCost) {
            cost = 0;
        } else {
            cost = Math.floor(cost / 100) * 100;
        }
        return cost;
    }

    // 여백 비용 계산
    function blank(blankYn) {
        const costs = {
            '3cm': 8400,
            '6cm': 16900,
            '11cm': 33100,
            '15cm': 44500
        };
        return costs[blankYn] || 0;
    }

    // 프레임 비용 계산
    function frame(frameName) {
        const costs = {
            '띄움': 4200,
            '원목 띄움': 16900,
            '울림 우드': 25400,
            '원목베이지': 29600,
            '관우드': 27500,
            '관블랙': 27500,
            '관화이트': 27500
        };
        return costs[frameName] || 0;
    }

    function commaNum(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function commaStr(num) {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

// ------------------------------- order -----------------------------------
    // 장바구니에 담긴 물건 생성
    const orderTbody = document.getElementById('order_tbody');
    const totalPr = document.getElementById('total_pr');
    const totalDe = document.getElementById('total_de');
    const finalTotalPr = document.getElementById('final_total_pr');
    const tempMileage = document.getElementById('temp_mileage');
    if (orderTbody) {
        let contextOrder = '';
        // 총 상품금액
        let totalCost = 0;
        // 배송비
        let delivery = 0;

        for (let i = 1; i <= cartItem(); i++) {
            let object = JSON.parse(localStorage.getItem(`cartItem${i}`));

            let sizePrice = sizeCo(object.unit, object.size);
            let blankPrice = blank(object.blank);
            let framePrice = frame(object.frame);
            // 리터치 필요 시 배송비 2000원 추가됨
            let totalPrice = (parseInt(sizePrice)
                    + blankPrice + framePrice
                    + parseInt(object.unit)
                    + (object.retouch === 1 ? 0 : 2500)
                    + (object.media === 1 ? 0 : 4200))
                * object.amount
            ;

            totalCost += totalPrice;
            delivery += object.retouch === 1 ? 0 : 2500;

            contextOrder += `
                <tr>
                    <td>
                        <p class="cart_no">${i}</p>
                    </td>
                    <td class="td_prd">
                        <div class="sod_img">
                            <a href="/shop/view/${object.goods_no}">
                                <img src="/images/goods/${object.poster}" alt="제품 이미지">
                            </a>
                        </div>
                        <div class="sod_name">
                            <a href="/shop/view/${object.goods_no}">
                                <dl>
                                    <dt>
                                        <strong>${object.title}</strong>
                                        <span class="f_color">${object.name}</span>
                                        <span class="price_txt">(+${commaStr(object.unit)})</span>
                                    </dt>
                                    <dd>사이즈 : ${object.size === 1 ? '30.0cm x 30.0cm' : '35.0cm x 35.0cm'}<span class="price_txt">(+${sizePrice})</span></dd>
                                    <dd>미디어 : ${object.media === 1 ? '캔버스' : '파인아트'}<span class="price_txt">(+${object.media === 1 ? '0' : '4,200'})</span></dd>
                                    <dd>리터치 : ${object.retouch === 1 ? '없음' : '선택'}<span class="price_txt">(+${object.retouch === 1 ? '0' : '2,500'})</span></dd>
                                    <dd>프레임 : ${object.frame}<span class="price_txt">(+${commaNum(framePrice)})</span></dd>
                                    <dd>매트(여백) : ${object.blank}<span class="price_txt">(+${commaNum(blankPrice)})</span></dd>
                                </dl>
                            </a>
                        </div>
                    </td>
                    <td>${commaStr(object.unit)} 원</td>
                    <td class="td_qua">${object.amount}</td>
                    <td>
                        <span class="total_prc">${commaNum(totalPrice)}</span> 원
                    </td>
                </tr>
            `;

        }
        orderTbody.innerHTML = contextOrder;
        totalPr.innerText = commaNum(totalCost);
        totalDe.innerText = commaNum(delivery);
        finalTotalPr.innerText = commaNum(totalCost + delivery);
        // 예상 적립 마일리지
        tempMileage.innerText = commaNum(Math.ceil(totalCost / 100000) * 3000)
    }

    // *** 주소 찾기 kakao.api ----
    // const orPostCode = document.getElementById('or_zoneCode');
    // const orAddress1 = document.getElementById('or_addr1');
    // const orAddress2 = document.getElementById('or_addr2');
    const dePostCode = document.getElementById('same4');
    const deAddress1 = document.getElementById('same5');
    const deAddress2 = document.getElementById('same6');

    // if(orPostCode) {
    //     document.getElementById('or_addr_click').addEventListener('click', function (e) {
    //         e.preventDefault();
    //         findAddress(orPostCode, orAddress1, orAddress2)
    //     });
    // }
    if (dePostCode) {
        document.getElementById('de_addr_click').addEventListener('click', function (e) {
            e.preventDefault();
            findAddress(dePostCode, deAddress1, deAddress2)
        });
    }

    // 카카오 주소 API
    function findAddress(zone, add1, focus) {
        new daum.Postcode({
            oncomplete: function (data) {
                let addr = data.address; // 최종 주소 변수
                let postC = data.zonecode; // 새 우편 주소
                // 주소 정보를 해당 필드에 넣는다.
                add1.value = addr;
                zone.value = postC;
            },
        }).open();
        focus.focus();
    }

    // 요청사항 선택
    const orderRequest = document.querySelector('#cart_order .ordered_info .order_request');
    if (orderRequest) {
        const orSelect = document.querySelector('#cart_order .ordered_info .select');
        document.getElementById('or_request').addEventListener('click', function () {
            orSelect.classList.add('on');
        });
        const requestLi = document.querySelectorAll('#cart_order .order_request li');
        requestLi.forEach(li => {
            li.addEventListener('click', function () {
                document.getElementById('or_request').value = li.innerText;
                if (li.innerText === '직접입력') {
                    orderRequest.classList.add('text');
                    orSelect.classList.remove('on');
                } else {
                    orderRequest.classList.remove('text');
                    orSelect.classList.remove('on');
                }
            });
        })
    }
    // 무통장 입금 토글
    const payDir = document.querySelector('#cart_order .pay_option .pay_dir a');
    if (payDir) {
        payDir.addEventListener('click', function () {
            payDir.closest('.pay_dir').classList.toggle('on');
        });
    }

    // 주문자와 동일 선택 시 필수 값에 값 채우기
    const newAddr = document.getElementById('new_addr');
    const sameAddr = document.getElementById('same_addr');
    const input = document.querySelectorAll('#get_table input[type=text]');
    if (sameAddr) {
        sameAddr.addEventListener('click', function () {
            sameAddr.checked = true;
            newAddr.checked = false;
            for (let i = 0; i < 6; i++) {
                let same = document.getElementById(`same${i + 1}`);
                same.value = input[i].value;
            }
        });
        newAddr.addEventListener('click', function () {
            newAddr.checked = true;
            sameAddr.checked = false;
            for (let i = 0; i < 6; i++) {
                let same = document.getElementById(`same${i + 1}`);
                same.value = '';
            }
        });
    }
    // 주문하기 버튼
    const orderSubmitBtn = document.querySelector('.or_btn_wrap button');
    if (orderSubmitBtn) {
        orderSubmitBtn.addEventListener('click', function () {
//            let product = '';

            const amountLength = document.querySelectorAll('#order_tbody tr .td_qua');

//            document.querySelectorAll('#order_tbody tr').forEach((item, idx) => {
//                const tdPrd = item.querySelector('.td_prd');
//                const src = item.querySelector('.sod_img img').getAttribute('src').split('/').pop();
//                const href = item.querySelector('.sod_img a').getAttribute('href').split('/').pop();
//                if (idx !== 0 && idx < amount.length) {
//                    product += '\n'
//                }
//                product += tdPrd.innerText;
//                product += `\n번호 : ${href}\n`;
//                product += `이미지 : ${src}\n`;
//                product += `수량 : ${amount[idx].innerText}\n`;
//            });

            // 필수 값
            const requiredIds = ['same1', 'same2', 'same4', 'same5'];
            const phoneRegex = /^(010[-.\s]?\d{4}[-.\s]?\d{4}|01[16789][-.\s]?\d{3,4}[-.\s]?\d{4})$/;
            for (let i = 0; i < 6; i++) {
                let same = document.getElementById(`same${i + 1}`);
                if (!phoneRegex.test(same.value) && i === 1) {
                    alert('올바른 전화번호 형식이 아닙니다.');
                    return;
                }
                if (requiredIds.includes(same.id) && same.value.trim() === '') {
                    alert('필수 값을 입력해 주세요.');
                    same.focus();
                    return;
                }
            }

            // 요청사항
            let request = document.getElementById('or_request').value.trim();
            const textarea = document.getElementById('or_textarea').value.trim();
            if (request === '직접입력') {
                document.getElementById('or_request').value = textarea;
                if (textarea === '') {
                    alert('요청 사항을 입력해 주세요.');
                    return;
                }
            }
            document.getElementById('pay_name').value = document.getElementById('paying_name').value;
            const priceSubstring = document.querySelector('#final_price_total p:last-child').innerText;
            document.getElementById('pay_price').value = priceSubstring.slice(0, -1);

            let product = [];
            for (let i = 1; i <= amountLength.length; i++) {
                let item = localStorage.getItem(`cartItem${i}`);
                if (item) { // item이 null이 아닐 경우에만 추가
                    product.push(JSON.parse(item)); // JSON으로 파싱하여 배열에 추가
                }
            }

            fetch("/rest/order_cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if(Array.isArray(data)){
                    document.getElementById('pay_product').value = data.join(', ');
                } else {
                    document.getElementById('pay_product').value = data;
                }
                let saveId = localStorage.getItem('saveId');
                localStorage.clear();
                if (saveId != null) {
                localStorage.setItem('saveId', saveId);
                }
                document.getElementById('order_form_submit').click();
            })
            .catch(error => {
                console.error("Error:", error); // 오류 처리
            });

        });

    }

    // const orderInfo = document.getElementById('order_info_tbody');
    // if (orderInfo) {
    //     const products = orderInfo.dataset.product;
    //     const items = products.trim().split(/\n\n/); // 빈 줄로 항목 분리
    //
    //     const product = items.map(item => {
    //         const lines = item.split('\n');
    //
    //         const title = lines[0].trim();
    //         const unit = parseInt(title.match(/\d+/g).join(''), 10);
    //         const no = lines.find(line => line.startsWith("번호")).split(' : ')[1].trim();
    //         const poster = lines.find(line => line.startsWith("이미지")).split(' : ')[1].trim();
    //         const size = lines.find(line => line.startsWith("사이즈")).split(' : ')[1].trim();
    //         const sizeP = parseInt(size.match(/\(\+\d+[,\d]*\)/g)?.[0]?.match(/\d+/g)?.join(''), 10);
    //         const media = lines.find(line => line.startsWith("미디어")).split(' : ')[1].trim();
    //         const mediaP = parseInt(media.match(/\d+/g).join(''), 10);
    //         const retouch = lines.find(line => line.startsWith("리터치")).split(' : ')[1].trim();
    //         const retouchP = parseInt(retouch.match(/\d+/g).join(''), 10);
    //         const frame = lines.find(line => line.startsWith('프레임')).split(' : ')[1].trim();
    //         const frameP = parseInt(frame.match(/\d+/g).join(''), 10);
    //         const blank = lines.find(line => line.startsWith('매트(여백)')).split(' : ')[1].trim();
    //         const blankP = parseInt(blank.match(/\d+/g).join(''), 10);
    //         const amount = parseInt(lines.find(line => line.startsWith('수량')).split(' : ')[1].trim(), 10);
    //         const total = (unit + sizeP + mediaP + retouchP + frameP + blankP) * amount;
    //
    //         return {title, unit, no, poster, size, media, retouch, frame, blank, amount, total};
    //     });
    //
    //     let orContext = '';
    //     for (let i = 0; i < product.length; i++) {
    //
    //         orContext += `
    //             <tr>
    //                 <td>
    //                     <p class="cart_no">${i + 1}</p>
    //                 </td>
    //                 <td class="td_prd">
    //                     <div class="sod_img">
    //                         <a href="/shop/view/${product[i].no}">
    //                             <img src="/images/goods/${product[i].poster}" alt="제품 이미지">
    //                         </a>
    //                     </div>
    //                     <div class="sod_name">
    //                         <a href="/shop/view/${product[i].no}">
    //                             <dl>
    //                                 <dt>
    //                                     <strong>${product[i].title}</strong>
    //                                 </dt>
    //                                 <dd>사이즈 : ${product[i].size}</dd>
    //                                 <dd>미디어 : ${product[i].media}</dd>
    //                                 <dd>리터치 : ${product[i].retouch}</dd>
    //                                 <dd>프레임 : ${product[i].frame}</dd>
    //                                 <dd>매트(여백) : ${product[i].blank}</dd>
    //                             </dl>
    //                         </a>
    //                     </div>
    //                 </td>
    //                 <td>${product[i].unit} 원</td>
    //                 <td class="td_qua">${product[i].amount}</td>
    //                 <td>
    //                     <span class="total_prc">${product[i].total}</span> 원
    //                 </td>
    //             </tr>
    //         `;
    //
    //     }
    //     orderInfo.innerHTML = orContext;
    // }
});
