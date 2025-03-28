var tongGioHang = 0;
var phiShip = 30000;
var giamGia = 0;

function loadPhiTinhTam(){
    document.getElementById("tamtinh").innerHTML = formatmoney(tongGioHang);
    document.getElementById("giamgia").innerHTML = formatmoney(giamGia);
    document.getElementById("phivanchuyen").innerHTML = formatmoney(phiShip);
    document.getElementById("tongcong").innerHTML = formatmoney(tongGioHang + phiShip - giamGia);
}



function checkout() {
    var con = confirm("Xác nhận đặt hàng!");
    if (con == false) {
        return;
    }
    var paytype = $('input[name=paytype]:checked').val()
    if (paytype == "cod") {
        paymentCod();
    }
    if (paytype == "vnpay") {
        requestPayMentVnpay();
    }
}



async function paymentCod() {
    var orderDto = {
        "payType": "COD",
        "idDiaChi": document.getElementById("sodiachi").value,
        "shipCost": phiShip,
        "note": document.getElementById("ghichu").value,
        "maVoucher": document.getElementById("voucher").value == -1 ? null: document.getElementById("voucher").value,
    }
    var url = 'http://localhost:8080/api/hoadon/user/create';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Đặt hàng thành công!",
                type: "success"
            },
            function() {
                window.location.replace("account.html")
            });
    }
}


async function requestPayMentVnpay() {
    var orderDto = {
        "payType": "VNPAY",
        "idDiaChi": document.getElementById("sodiachi").value,
        "shipCost": phiShip,
        "note": document.getElementById("ghichu").value,
        "maVoucher": document.getElementById("voucher").value == -1 ? null: document.getElementById("voucher").value,
    }
    window.localStorage.setItem("orderDto", JSON.stringify(orderDto));
    var returnurl = 'http://localhost:5500/payment.html';

    var urlinit = 'http://localhost:8080/api/vnpay/user/urlpayment';
    var paymentDto = {
        "returnUrl": returnurl,
        "tongTien": tongGioHang + phiShip - giamGia,
    }
    console.log(paymentDto)
    const res = await fetch(urlinit, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(paymentDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        window.open(result.url, '_blank');
    }
    if (res.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }

}


async function paymentOnline() {
    var uls = new URL(document.URL)
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
    var orderDto = window.localStorage.getItem("orderDto");
    orderDto = JSON.parse(orderDto);
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark
    orderDto.vnpOrderInfo = vnpOrderInfo
    orderDto.urlVnpay = urlVnpay
    var url = 'http://localhost:8080/api/hoadon/user/create';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
    }
    if (res.status == exceptionCode) {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }

}


async function loadMyInvoice() {
    var url = 'http://localhost:8080/api/hoadon/user/my-hoadon';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].createdAt}</td>
                    <td>${formatmoney(list[i].tongGia + list[i].phiShip)}</td>
                    <td>${formatmoney(list[i].phiShip)}</td>
                    <td>
                        <strong>Họ tên</strong>: ${list[i].hoTen}<br>
                        <strong>Số điện thoại</strong>: ${list[i].soDienThoai}<br>
                        <strong>Địa chỉ</strong>: ${list[i].diaChi}<br>
                    </td>
                    <td>${list[i].trangThai}</td>
                    <td>
                        <button onclick="loadDetailInvoice(${list[i].id})" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#orderDetailModal">
                            Chi tiết
                        </button>
                    </td>
                </tr>`
    }
    document.getElementById("listinvoice").innerHTML = main

}


async function loadDetailInvoice(id) {
    var url = 'http://localhost:8080/api/hoadon/user/find-by-id?id='+id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await res.json();
    document.getElementById("ngaydat").innerHTML = result.createdAt
    document.getElementById("trangthai").innerHTML = result.trangThai
    document.getElementById("pttt").innerHTML = result.loaiThanhToan
    document.getElementById("hotengh").innerHTML = result.hoTen
    document.getElementById("sdtgh").innerHTML = result.soDienThoai
    document.getElementById("dcgh").innerHTML = result.diaChi
    document.getElementById("tamtinhgia").innerHTML = formatmoney(result.tongGia)
    document.getElementById("phivc").innerHTML = formatmoney(result.phiShip)
    document.getElementById("tongcong").innerHTML = formatmoney(result.phiShip + result.tongGia)
    document.getElementById("giamgiavc").innerHTML = result.voucherDonHang == null?'0đ': formatmoney(result.voucherDonHang.giaTriGiam)

    var url = 'http://localhost:8080/api/hoadon/user/hdct-by-hoadon?id='+id;
    const resp = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await resp.json();
    var main = ''
    for(i=0; i< list.length; i++){
        main += `<tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${list[i].sanPhamChiTiet.anh}" alt="Túi xách" style="width: 50px; height: 50px; object-fit: cover" class="me-2">
                            <span>${list[i].sanPhamChiTiet.sanPham.tenSanPham}</span>
                        </div>
                    </td>
                    <td>${formatmoney(list[i].gia)}</td>
                    <td>${list[i].soLuong}</td>
                    <td>${formatmoney(list[i].gia *list[i].soLuong )}</td>
                </tr>`
    }
    document.getElementById("listDetailinvoice").innerHTML = main

}
